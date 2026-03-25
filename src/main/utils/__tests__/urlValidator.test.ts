import { describe, it, expect } from 'vitest'
import { validateExternalUrl } from '../urlValidator'

describe('validateExternalUrl', () => {
  describe('valid URLs', () => {
    it('should accept https://github.com URLs', () => {
      const result = validateExternalUrl('https://github.com/blas-works/hollow')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should accept https://github.io subdomains', () => {
      const result = validateExternalUrl('https://blas-works.github.io/project')
      expect(result.isValid).toBe(true)
    })

    it('should accept paths and query params', () => {
      const result = validateExternalUrl('https://github.com/user/repo?tab=readme')
      expect(result.isValid).toBe(true)
    })
  })

  describe('blocked protocols', () => {
    it('should reject http:// URLs', () => {
      const result = validateExternalUrl('http://github.com/user/repo')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('HTTPS')
    })

    it('should reject file:// URLs', () => {
      const result = validateExternalUrl('file:///etc/passwd')
      expect(result.isValid).toBe(false)
    })

    it('should reject javascript: URLs', () => {
      const result = validateExternalUrl('javascript:alert(1)')
      expect(result.isValid).toBe(false)
    })

    it('should reject data: URLs', () => {
      const result = validateExternalUrl('data:text/html,<script>alert(1)</script>')
      expect(result.isValid).toBe(false)
    })
  })

  describe('blocked domains', () => {
    it('should reject other domains', () => {
      const result = validateExternalUrl('https://malicious-site.com')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('not in the whitelist')
    })

    it('should reject lookalike domains', () => {
      const result = validateExternalUrl('https://github.com.evil.com')
      expect(result.isValid).toBe(false)
    })

    it('should reject subdomains of blocked domains', () => {
      const result = validateExternalUrl('https://evil.com')
      expect(result.isValid).toBe(false)
    })
  })

  describe('invalid URLs', () => {
    it('should reject malformed URLs', () => {
      const result = validateExternalUrl('not-a-url')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Invalid URL')
    })

    it('should reject empty string', () => {
      const result = validateExternalUrl('')
      expect(result.isValid).toBe(false)
    })
  })
})
