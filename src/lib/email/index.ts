import { getResend, from, ownerEmail } from './client';
import {
  contactNotificationHtml,
  auditOwnerHtml,
  auditConfirmationHtml,
  foundingClientOwnerHtml,
  pdfLeadOwnerHtml,
  clientInviteHtml,
} from './templates';

type ContactData = { name: string; email: string; website: string; reason: string | null; message: string | null };
type AuditData = { name: string; email: string; storeUrl: string; phone: string | null };
type FoundingData = { store: string; revenue: string; sessions: string; ads: string | null; problem: string; other: string | null; email: string | null };
type PdfData = { email: string; tier: string | null; url: string | null };
type InviteData = { name: string; email: string };

async function send(args: Parameters<ReturnType<typeof getResend>['emails']['send']>[0]): Promise<void> {
  const { error } = await getResend().emails.send(args);
  if (error) throw new Error(`Resend error: ${error.message}`);
}

export async function sendContactNotification(data: ContactData): Promise<void> {
  await send({
    from: from(),
    to: ownerEmail(),
    subject: `New enquiry: ${data.reason ?? 'General'} — ${data.name}`,
    html: contactNotificationHtml(data),
  });
}

export async function sendAuditNotifications(data: AuditData): Promise<void> {
  await Promise.all([
    send({
      from: from(),
      to: ownerEmail(),
      subject: `New audit request — ${data.name} (${data.storeUrl})`,
      html: auditOwnerHtml(data),
    }),
    send({
      from: from(),
      to: data.email,
      subject: "We've received your request — Duha Media",
      html: auditConfirmationHtml({ name: data.name }),
    }),
  ]);
}

export async function sendFoundingClientNotification(data: FoundingData): Promise<void> {
  await send({
    from: from(),
    to: ownerEmail(),
    subject: `New founding client application — ${data.store}`,
    html: foundingClientOwnerHtml(data),
  });
}

export async function sendPdfLeadNotification(data: PdfData): Promise<void> {
  await send({
    from: from(),
    to: ownerEmail(),
    subject: `New PDF lead — ${data.tier ?? 'Unknown'} brief`,
    html: pdfLeadOwnerHtml(data),
  });
}

export async function sendClientInvite(data: InviteData): Promise<void> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://duhamedia.com';
  await send({
    from: from(),
    to: data.email,
    subject: "You've been invited to the Duha Media portal",
    html: clientInviteHtml({ name: data.name, signInUrl: `${siteUrl}/auth/sign-in` }),
  });
}
