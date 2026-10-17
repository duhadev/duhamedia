/**
 * Pure lead-magnet asset rule (SCHEMA.md §6.8: `asset` = an uploaded file OR an
 * external URL, validate exactly one). Shared by the server validators in
 * src/collections/LeadMagnets.ts and the admin client components in
 * src/components/admin/LeadMagnetAssetFields.tsx, so the browser flags it exactly
 * as the server does. No imports: safe in 'use client'.
 *
 * Where each error shows: "neither" on the file field, "both" on the link
 * field (one message per problem, next to the field an editor would fix).
 */
export const ASSET_MISSING_MESSAGE = 'Upload the file, or add a link to it below.'
export const ASSET_BOTH_MESSAGE = 'Use either the uploaded file or this link, not both. Clear one of them.'
export const ASSET_URL_FORMAT_MESSAGE = 'Enter a full https:// address, e.g. https://example.com/guide.pdf'

const filled = (v: unknown): boolean =>
  v !== null && v !== undefined && !(typeof v === 'string' && v.trim() === '')

type AssetSiblings = { file?: unknown; externalUrl?: unknown } | null | undefined

/** Error for the `file` upload, or `true`. */
export const assetFileError = (value: unknown, siblings: unknown): true | string => {
  if (filled(value)) return true
  return filled((siblings as AssetSiblings)?.externalUrl) ? true : ASSET_MISSING_MESSAGE
}

/** Error for the `externalUrl` text field, or `true`. */
export const assetUrlError = (value: unknown, siblings: unknown): true | string => {
  if (!filled(value)) return true
  try {
    if (new URL(String(value).trim()).protocol !== 'https:') return ASSET_URL_FORMAT_MESSAGE
  } catch {
    return ASSET_URL_FORMAT_MESSAGE
  }
  return filled((siblings as AssetSiblings)?.file) ? ASSET_BOTH_MESSAGE : true
}
