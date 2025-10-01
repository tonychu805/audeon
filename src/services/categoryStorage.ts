import { logger } from '../utils/logger';
import { supabase } from '../lib/supabase';
import { getStorageUrl } from './database';
import { CategoryAsset } from '../types';

interface CategoryStorageConfig {
  basePath: string;
  sizes: {
    hero: { width: number; height: number };
    mobile: { width: number; height: number };
    thumbnail: { width: number; height: number };
  };
  formats: string[];
}

interface ProcessImageResult {
  sizeType: string;
  format: string;
  path?: string;
  success: boolean;
  error?: Error;
}

export class CategoryStorageService {
  private config: CategoryStorageConfig = {
    basePath: 'categories',
    sizes: {
      hero: { width: 600, height: 400 },
      mobile: { width: 400, height: 250 },
      thumbnail: { width: 200, height: 133 }
    },
    formats: ['webp', 'jpg'] // WebP first for modern browsers
  };

  // Generate storage paths dynamically
  getAssetPath(categorySlug: string, level: number, assetType: string, format: string): string {
    const levelPath = level === 1 ? 'main' : 'subcategories';
    return `${this.config.basePath}/${levelPath}/${categorySlug}/${assetType}.${format}`;
  }

  // Get optimized image URL with fallbacks
  async getOptimizedImageUrl(
    categoryId: string, 
    assetType: 'hero' | 'mobile' | 'thumbnail'
  ): Promise<string> {
    try {
      // Try to get from database first
      const { data: assets, error } = await supabase
        .from('category_assets')
        .select('file_path, format')
        .eq('category_id', categoryId)
        .eq('asset_type', assetType)
        .eq('is_primary', true)
        .order('format', { ascending: true }); // WebP comes first

      if (error) {
        logger.error('Error fetching category assets:', error);
      }

      if (assets && assets.length > 0) {
        // Return WebP if available, fallback to JPG
        const webpAsset = assets.find(a => a.format === 'webp');
        const jpgAsset = assets.find(a => a.format === 'jpg');
        const selectedAsset = webpAsset || jpgAsset || assets[0];
        
        return getStorageUrl('category_images', selectedAsset.file_path);
      }

      // Fallback to default template
      return getStorageUrl('category_images', `${this.config.basePath}/templates/default-${assetType}.jpg`);
    } catch (error) {
      logger.error('Error getting optimized image URL:', error);
      // Return fallback for any error
      return getStorageUrl('category_images', `${this.config.basePath}/templates/default-${assetType}.jpg`);
    }
  }

  // Get fallback image URL (for migration period)
  getFallbackImageUrl(categoryName: string): string {
    const imageMap: { [key: string]: string } = {
      'business': '1507679799987-cfe2ef4d2e1f',
      'product management': '1611224923853-80b023f02d71',
      'marketing': '1504711434969-e33886168f5c',
      'data science': '1551288049-d7102ea010ae',
      'psychology': '1559757148-5c350d0d3c56',
      'technology': '1586339949916-3e9457bef6d3',
      'wellness': '1544367567-0f2fcb009e0b',
      'productivity': '1521737602349-7179cfd77f68'
    };
    
    const normalizedName = categoryName.trim().toLowerCase();
    const imageId = imageMap[normalizedName] || '1586339949916-3e9457bef6d3';
    return `https://images.unsplash.com/photo-${imageId}?auto=format&fit=crop&w=600&h=400&q=80`;
  }

  // Upload and process category assets
  async uploadCategoryAssets(
    categoryId: string, 
    categorySlug: string, 
    level: number, 
    file: File
  ): Promise<ProcessImageResult[]> {
    const results: ProcessImageResult[] = [];
    
    for (const [sizeType, dimensions] of Object.entries(this.config.sizes)) {
      for (const format of this.config.formats) {
        try {
          // For now, use original file (implement image processing later)
          const processedFile = await this.processImage(file, dimensions, format);
          const path = this.getAssetPath(categorySlug, level, sizeType, format);
          
          // Upload to Supabase Storage
          const { error: uploadError } = await supabase.storage
            .from('category_images')
            .upload(path, processedFile, {
              cacheControl: '3600',
              upsert: true // Allow overwriting existing files
            });

          if (!uploadError) {
            // Record in database
            const { error: dbError } = await supabase
              .from('category_assets')
              .upsert({
                category_id: categoryId,
                asset_type: sizeType as 'hero' | 'mobile' | 'thumbnail',
                file_path: path,
                file_size: processedFile.size,
                dimensions: dimensions,
                format: format as 'jpg' | 'webp' | 'svg' | 'png',
                is_primary: format === 'webp' || (format === 'jpg' && this.config.formats[0] !== 'webp')
              }, { 
                onConflict: 'category_id,asset_type,format'
              });

            if (dbError) {
              logger.error(`Database error for ${sizeType} ${format}:`, dbError);
            }
            
            results.push({ sizeType, format, path, success: true });
            logger.info(`Uploaded ${sizeType} ${format} for category ${categorySlug}`);
          } else {
            logger.error(`Upload error for ${sizeType} ${format}:`, uploadError);
            results.push({ sizeType, format, success: false, error: uploadError });
          }
        } catch (error) {
          logger.error(`Failed to process ${sizeType} ${format}:`, error);
          results.push({ sizeType, format, success: false, error });
        }
      }
    }
    
    return results;
  }
  
  // Simple image processing (placeholder for now)
  private async processImage(
    file: File, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _dimensions: { width: number; height: number }, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _format: string
  ): Promise<File> {
    // For now, return the original file
    // TODO: Implement actual image resizing and format conversion
    // You could use libraries like:
    // - Sharp.js (server-side)
    // - Canvas API (client-side)
    // - ImageKit/Cloudinary (service)
    
    return file;
  }

  // Delete category assets
  async deleteCategoryAssets(categoryId: string): Promise<boolean> {
    try {
      // Get all assets for this category
      const { data: assets, error: fetchError } = await supabase
        .from('category_assets')
        .select('file_path')
        .eq('category_id', categoryId);

      if (fetchError) {
        logger.error('Error fetching assets to delete:', fetchError);
        return false;
      }

      if (assets && assets.length > 0) {
        // Delete files from storage
        const filePaths = assets.map(asset => asset.file_path);
        const { error: storageError } = await supabase.storage
          .from('category_images')
          .remove(filePaths);

        if (storageError) {
          logger.error('Error deleting files from storage:', storageError);
          // Continue with database deletion even if storage fails
        }

        // Delete database records
        const { error: dbError } = await supabase
          .from('category_assets')
          .delete()
          .eq('category_id', categoryId);

        if (dbError) {
          logger.error('Error deleting asset records:', dbError);
          return false;
        }
      }

      return true;
    } catch (error) {
      logger.error('Error in deleteCategoryAssets:', error);
      return false;
    }
  }

  // Get all assets for a category
  async getCategoryAssets(categoryId: string): Promise<CategoryAsset[]> {
    try {
      const { data, error } = await supabase
        .from('category_assets')
        .select('*')
        .eq('category_id', categoryId)
        .order('asset_type')
        .order('is_primary', { ascending: false });

      if (error) {
        logger.error('Error fetching category assets:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('Error in getCategoryAssets:', error);
      return [];
    }
  }
}

// Export singleton instance
export const categoryStorage = new CategoryStorageService();