export const ALLOWED_DOMAINS = ['github.com', 'github.io'] as const
export const ALLOWED_PROTOCOLS = ['https:'] as const

export type AllowedDomain = (typeof ALLOWED_DOMAINS)[number]
export type AllowedProtocol = (typeof ALLOWED_PROTOCOLS)[number]

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export function validateExternalUrl(url: string): ValidationResult {
  try {
    const parsedUrl = new URL(url)

    if (!ALLOWED_PROTOCOLS.includes(parsedUrl.protocol as AllowedProtocol)) {
      return {
        isValid: false,
        error: `Protocol ${parsedUrl.protocol} is not allowed. Only HTTPS is permitted.`
      }
    }

    const isAllowed = ALLOWED_DOMAINS.some(
      (domain) => parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
    )

    if (!isAllowed) {
      return {
        isValid: false,
        error: `Domain ${parsedUrl.hostname} is not in the whitelist.`
      }
    }

    return { isValid: true }
  } catch (error) {
    return {
      isValid: false,
      error: `Invalid URL: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}
