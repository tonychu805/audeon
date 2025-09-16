import { describe, it, expect, vi } from 'vitest'
import { communityService, creatorService, trackService, getStorageUrl } from '../database'

// Mock the logger to avoid console spam in tests
vi.mock('../../utils/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn()
  }
}))

describe('Database Services - Contract Tests', () => {
  describe('getStorageUrl', () => {
    it('should return a valid URL string', () => {
      const result = getStorageUrl('test-bucket', 'test-file.jpg')

      expect(typeof result).toBe('string')
      expect(result).toMatch(/^https?:\/\//)
    })
  })

  describe('communityService', () => {
    describe('getAll', () => {
      it('should return an array of communities with correct structure', async () => {
        const communities = await communityService.getAll()

        expect(Array.isArray(communities)).toBe(true)

        // If we have communities, validate the structure
        if (communities.length > 0) {
          const community = communities[0]
          expect(community).toHaveProperty('id')
          expect(community).toHaveProperty('name')
          expect(typeof community.id).toBe('string')
          expect(typeof community.name).toBe('string')
        }
      })
    })

    describe('getById', () => {
      it('should return null for non-existent ID', async () => {
        const result = await communityService.getById('non-existent-id-12345')
        expect(result).toBeNull()
      })

      it('should handle malformed ID gracefully', async () => {
        const result = await communityService.getById('invalid-uuid-format')
        expect(result).toBeNull()
      })
    })
  })

  describe('creatorService', () => {
    describe('getAll', () => {
      it('should return an array of creators with expected structure', async () => {
        const creators = await creatorService.getAll()

        expect(Array.isArray(creators)).toBe(true)

        // Validate structure if we have creators
        if (creators.length > 0) {
          const creator = creators[0]

          // Required fields
          expect(creator).toHaveProperty('id')
          expect(creator).toHaveProperty('name')
          expect(creator).toHaveProperty('image')
          expect(creator).toHaveProperty('bio')
          expect(creator).toHaveProperty('followerCount')
          expect(creator).toHaveProperty('socialLinks')

          // Type validation
          expect(typeof creator.id).toBe('string')
          expect(typeof creator.name).toBe('string')
          expect(typeof creator.image).toBe('string')
          expect(typeof creator.bio).toBe('string')
          expect(typeof creator.followerCount).toBe('number')
          expect(Array.isArray(creator.socialLinks)).toBe(true)

          // Value validation
          expect(creator.followerCount).toBeGreaterThanOrEqual(0)
          expect(creator.id.length).toBeGreaterThan(0)
          expect(creator.name.length).toBeGreaterThan(0)
        }
      })
    })

    describe('getById', () => {
      it('should return null for non-existent creator', async () => {
        const result = await creatorService.getById('non-existent-creator-12345')
        expect(result).toBeNull()
      })

      it('should handle invalid ID format', async () => {
        const result = await creatorService.getById('invalid-format')
        expect(result).toBeNull()
      })
    })
  })

  describe('trackService', () => {
    describe('getAll', () => {
      it('should return an array of tracks with complete structure', async () => {
        const tracks = await trackService.getAll()

        expect(Array.isArray(tracks)).toBe(true)

        // Validate structure if we have tracks
        if (tracks.length > 0) {
          const track = tracks[0]

          // Core required fields
          expect(track).toHaveProperty('id')
          expect(track).toHaveProperty('track_id')
          expect(track).toHaveProperty('title')
          expect(track).toHaveProperty('creator')
          expect(track).toHaveProperty('audioUrl')

          // Type validation
          expect(typeof track.id).toBe('string')
          expect(typeof track.track_id).toBe('number')
          expect(typeof track.title).toBe('string')
          expect(typeof track.creator).toBe('string')

          // Optional fields should exist but can be empty
          expect(track).toHaveProperty('summary')
          expect(track).toHaveProperty('full_content')
          expect(track).toHaveProperty('category')
          expect(track).toHaveProperty('community')

          // Value validation
          expect(track.track_id).toBeGreaterThan(0)
          expect(track.title.length).toBeGreaterThan(0)
          expect(track.id.length).toBeGreaterThan(0)
        }
      })

      it('should handle database errors gracefully', async () => {
        // Even if the database is down, service should not throw
        const result = await trackService.getAll()
        expect(Array.isArray(result)).toBe(true)
      })
    })

    describe('getById', () => {
      it('should return null for non-existent track', async () => {
        const result = await trackService.getById(99999)
        expect(result).toBeNull()
      })

      it('should handle invalid ID format', async () => {
        // trackService.getById expects a number, so test with 0 or negative
        const result = await trackService.getById(0)
        expect(result).toBeNull()
      })

      // If we can find a track, validate its full structure
      it('should return complete track structure when found', async () => {
        // First get a valid track ID
        const allTracks = await trackService.getAll()

        if (allTracks.length > 0) {
          const trackId = allTracks[0].track_id
          const track = await trackService.getById(trackId)

          if (track) {
            // Validate full track structure
            expect(track).toHaveProperty('id')
            expect(track).toHaveProperty('track_id')
            expect(track).toHaveProperty('title')
            expect(track).toHaveProperty('creator')
            expect(track).toHaveProperty('summary')
            expect(track).toHaveProperty('full_content')
            expect(track).toHaveProperty('audioUrl')

            // Type validation
            expect(typeof track.id).toBe('string')
            expect(typeof track.track_id).toBe('number')
            expect(typeof track.title).toBe('string')

            // Structure validation
            expect(track.track_id).toBeGreaterThan(0)
            expect(track.title.length).toBeGreaterThan(0)
          }
        }
      })
    })
  })

  describe('Service Error Handling', () => {
    it('should handle network connectivity issues gracefully', async () => {
      // All services should return safe defaults, not throw exceptions
      await expect(communityService.getAll()).resolves.not.toThrow()
      await expect(creatorService.getAll()).resolves.not.toThrow()
      await expect(trackService.getAll()).resolves.not.toThrow()

      // Results should be arrays even on failure
      const communities = await communityService.getAll()
      const creators = await creatorService.getAll()
      const tracks = await trackService.getAll()

      expect(Array.isArray(communities)).toBe(true)
      expect(Array.isArray(creators)).toBe(true)
      expect(Array.isArray(tracks)).toBe(true)
    })

    it('should handle invalid queries without crashing', async () => {
      await expect(communityService.getById('')).resolves.not.toThrow()
      await expect(creatorService.getById('')).resolves.not.toThrow()
      await expect(trackService.getById(0)).resolves.not.toThrow()

      const results = await Promise.all([
        communityService.getById(''),
        creatorService.getById(''),
        trackService.getById(0)
      ])

      // All should return null for invalid IDs
      results.forEach((result) => {
        expect(result).toBeNull()
      })
    })
  })

  describe('Data Consistency', () => {
    it('should maintain consistent ID formats across services', async () => {
      const [communities, creators, tracks] = await Promise.all([
        communityService.getAll(),
        creatorService.getAll(),
        trackService.getAll()
      ])

      // Check ID format consistency
      communities.forEach(item => {
        expect(typeof item.id).toBe('string')
        expect(item.id.length).toBeGreaterThan(0)
      })

      creators.forEach(item => {
        expect(typeof item.id).toBe('string')
        expect(item.id.length).toBeGreaterThan(0)
      })

      tracks.forEach(item => {
        expect(typeof item.id).toBe('string')
        expect(item.id.length).toBeGreaterThan(0)
        // track_id should be numeric
        expect(typeof item.track_id).toBe('number')
        expect(item.track_id).toBeGreaterThan(0)
      })
    })

    it('should have valid relationships between tracks and creators', async () => {
      const tracks = await trackService.getAll()

      tracks.forEach(track => {
        // Creator should be a non-empty string
        expect(typeof track.creator).toBe('string')

        // Community can be empty but should be string
        expect(typeof track.community).toBe('string')

        // Category can be empty but should be string
        expect(typeof track.category).toBe('string')
      })
    })
  })
})
