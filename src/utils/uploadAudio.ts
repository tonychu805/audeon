import { supabase } from '../lib/supabase';

export const uploadAudioFile = async (file: File, filename: string) => {
  try {
    const { data, error } = await supabase.storage
      .from('audio-files')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('audio-files')
      .getPublicUrl(filename);

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path
    };
  } catch (error) {
    console.error('Error uploading audio file:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const listAudioFiles = async () => {
  try {
    const { data, error } = await supabase.storage
      .from('audio-files')
      .list();

    if (error) {
      throw error;
    }

    return {
      success: true,
      files: data
    };
  } catch (error) {
    console.error('Error listing audio files:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};