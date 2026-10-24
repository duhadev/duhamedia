/**
 * The double opt-in confirmation email. Placeholder copy in brand voice
 * (direct, no fluff) — final wording is the human's call (flagged for the PM).
 * Plain HTML + text, no tracking pixels, no images. The link is the only
 * dynamic value and is our own URL (base64url token), so nothing here needs
 * escaping beyond the attribute quote, which the token alphabet never contains.
 * Sender: the email adapter's default from-address (src/payload.config.ts).
 */
export const confirmationEmail = (link: string) => ({
  subject: 'Confirm your Duha Media newsletter signup',
  text: [
    'One click and you are on the list.',
    '',
    'Someone (we hope you) asked to get the Duha Media newsletter at this address. Confirm here:',
    link,
    '',
    'The link works for 72 hours. If this was not you, ignore this email: nothing happens and you will not hear from us.',
    '',
    'Duha Media, Chicago',
  ].join('\n'),
  html: `<!doctype html><html><body style="margin:0;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#111;line-height:1.5">
<p style="margin:0 0 16px;font-size:18px;font-weight:bold">One click and you are on the list.</p>
<p style="margin:0 0 16px">Someone (we hope you) asked to get the Duha Media newsletter at this address.</p>
<p style="margin:0 0 24px"><a href="${link}" style="display:inline-block;padding:12px 20px;background:#111;color:#fff;text-decoration:none;font-weight:bold">Confirm my subscription</a></p>
<p style="margin:0 0 16px;font-size:14px;color:#555">Or paste this link into your browser:<br>${link}</p>
<p style="margin:0 0 16px;font-size:14px;color:#555">The link works for 72 hours. If this was not you, ignore this email: nothing happens and you will not hear from us.</p>
<p style="margin:0;font-size:14px;color:#555">Duha Media, Chicago</p>
</body></html>`,
})
