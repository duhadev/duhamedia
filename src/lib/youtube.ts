/**
 * YouTube helpers (Gate S Q5, Decision log 2026-10-17: video = YouTube unlisted,
 * embedded via youtube-nocookie.com, poster stored locally in `media`).
 *
 * Shared by the schema validators (src/fields) and, later, the video
 * components, so "what counts as a valid video URL" has one definition.
 */

const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
])

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/

/**
 * The 11-character video id of an https YouTube URL, or `null`.
 * Accepts watch?v=, youtu.be/, /embed/, /shorts/ and /live/ forms.
 */
export const youtubeVideoId = (input: string): string | null => {
  let url: URL
  try {
    url = new URL(input.trim())
  } catch {
    return null
  }
  if (url.protocol !== 'https:' || !YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) return null

  const parts = url.pathname.split('/').filter(Boolean)
  let id: string | null | undefined
  if (url.hostname.toLowerCase() === 'youtu.be') id = parts[0]
  else if (parts[0] === 'watch') id = url.searchParams.get('v')
  else if (['embed', 'shorts', 'live'].includes(parts[0] ?? '')) id = parts[1]

  return id && VIDEO_ID.test(id) ? id : null
}
