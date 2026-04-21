const INK = '#0F172A';
const MAGENTA = '#e82561';
const OFFWHITE = '#F8F8F6';
const MUTED = '#64748b';

function base(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:${OFFWHITE};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${OFFWHITE};padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:2px;overflow:hidden;max-width:560px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:${INK};padding:24px 32px;">
            <span style="font-family:'Courier New',monospace;font-size:11px;color:rgba(255,255,255,0.4);letter-spacing:0.12em;text-transform:uppercase;">Duha Media</span>
          </td>
        </tr>
        <!-- Body -->
        <tr><td style="padding:32px;">${body}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:11px;color:${MUTED};font-family:'Courier New',monospace;">
              duhamedia.com
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function h1(text: string): string {
  return `<h1 style="margin:0 0 20px;font-size:22px;font-weight:700;color:${INK};letter-spacing:-0.02em;line-height:1.3;">${text}</h1>`;
}

function p(text: string): string {
  return `<p style="margin:0 0 12px;font-size:15px;color:#374151;line-height:1.6;">${text}</p>`;
}

function field(label: string, value: string | null | undefined): string {
  if (!value) return '';
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:11px;font-family:'Courier New',monospace;color:${MUTED};text-transform:uppercase;letter-spacing:0.08em;white-space:nowrap;padding-right:16px;vertical-align:top;">${label}</td>
    <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:${INK};vertical-align:top;">${value}</td>
  </tr>`;
}

function table(...rows: string[]): string {
  return `<table cellpadding="0" cellspacing="0" style="width:100%;margin:20px 0;">${rows.join('')}</table>`;
}

function cta(label: string, href: string): string {
  return `<p style="margin:24px 0 0;"><a href="${href}" style="display:inline-block;background:${MAGENTA};color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:12px 24px;border-radius:2px;">${label}</a></p>`;
}

// ─── Owner notification templates ────────────────────────────────────────────

export function contactNotificationHtml(data: {
  name: string; email: string; website: string;
  reason: string | null; message: string | null;
}): string {
  return base('New enquiry', `
    ${h1('New contact enquiry')}
    ${table(
      field('Name', data.name),
      field('Email', data.email),
      field('Website', data.website),
      field('Reason', data.reason),
      field('Message', data.message),
    )}
    ${cta('View in inbox', `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://duhamedia.com'}/admin/inbox`)}
  `);
}

export function auditOwnerHtml(data: {
  name: string; email: string; storeUrl: string; phone: string | null;
}): string {
  return base('New audit request', `
    ${h1('New audit request')}
    ${table(
      field('Name', data.name),
      field('Email', data.email),
      field('Store URL', data.storeUrl),
      field('Phone', data.phone),
    )}
    ${cta('View in admin', `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://duhamedia.com'}/admin`)}
  `);
}

export function foundingClientOwnerHtml(data: {
  store: string; revenue: string; sessions: string;
  ads: string | null; problem: string; other: string | null; email: string | null;
}): string {
  return base('New founding client application', `
    ${h1('New founding client application')}
    ${table(
      field('Store', data.store),
      field('Revenue', data.revenue),
      field('Monthly sessions', data.sessions),
      field('Paid ads', data.ads),
      field('Email', data.email),
      field('Main problem', data.problem),
      field('Anything else', data.other),
    )}
    ${cta('View in admin', `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://duhamedia.com'}/admin`)}
  `);
}

export function pdfLeadOwnerHtml(data: {
  email: string; tier: string | null; url: string | null;
}): string {
  return base('New PDF lead', `
    ${h1('New service brief download')}
    ${table(
      field('Email', data.email),
      field('Tier', data.tier),
      field('Their URL', data.url),
    )}
  `);
}

// ─── Client / user-facing templates ──────────────────────────────────────────

export function auditConfirmationHtml(data: { name: string }): string {
  return base("We've received your request", `
    ${h1(`Thanks, ${data.name}.`)}
    ${p("We've received your audit request and will be in touch within one business day.")}
    ${p("In the meantime, if you have any questions feel free to reply to this email.")}
    <p style="margin:24px 0 0;font-size:13px;color:${MUTED};">— The Duha Media team</p>
  `);
}

export function clientInviteHtml(data: { name: string; signInUrl: string }): string {
  return base("You've been invited", `
    ${h1(`Hi${data.name ? ` ${data.name}` : ''} — you've been invited.`)}
    ${p("Your Duha Media client portal is ready. You can log in to view your CRO experiments, metrics, and reports.")}
    ${p("Click the button below and enter your email address. We'll send you a one-time code to sign in — no password needed.")}
    ${cta('Access your portal', data.signInUrl)}
    <p style="margin:20px 0 0;font-size:12px;color:${MUTED};">If you weren't expecting this, you can ignore this email.</p>
  `);
}
