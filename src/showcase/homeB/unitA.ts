import { CAPACITY, FOUNDER } from '@/lib/homeCopy'
import type { Client, Media, TeamMember } from '@/payload-types'

import type { ShowcaseData, ShowcaseEntry } from '../registry'

/**
 * Home B (design-reference/home-b-2026-11-09) unit A fixtures. Owned by the unit A block-coder.
 * `previewScarcity` is a showcase-only prop (registry `ShowcaseExtras`).
 */
const founderPhoto: Media = {
  id: 9101,
  alt: 'Founder portrait (placeholder)',
  url: '/api/media/file/founder-avatar.jpg',
  width: 800,
  height: 800,
  mimeType: 'image/jpeg',
  updatedAt: '',
  createdAt: '',
}

const abuOud: Client = { id: 9201, name: 'ABU OUD', logo: null, _status: 'published', updatedAt: '', createdAt: '' }

const capacityBase: ShowcaseData<'proofStrip'> = {
  variant: 'capacity',
  capacityStatement: 'spots',
  logos: { show: true, eyebrow: CAPACITY.logosEyebrow, source: 'manual', clients: [abuOud] },
}

const counts = { activeClients: 3, capacity: 7 }

const member: TeamMember = {
  id: 9301,
  _status: 'published',
  name: 'Abdurrahman Choudhary',
  role: 'Founder, Duha Media',
  bio: 'Not shown in the homepage section presentation.',
  photo: founderPhoto,
  socials: [
    { id: 'ua-sm-1', platform: 'x', url: 'https://x.com/' },
    { id: 'ua-sm-2', platform: 'instagram', url: 'https://www.instagram.com/' },
    { id: 'ua-sm-3', platform: 'linkedin', url: 'https://www.linkedin.com/' },
    { id: 'ua-sm-4', platform: 'github', url: 'https://github.com/' },
  ],
  createdAt: '',
  updatedAt: '',
}

export const unitAEntries: ShowcaseEntry[] = [
  {
    block: 'proofStrip',
    variant: 'capacity',
    label: 'ProofStrip capacity (home B): 3 / 7 loud, reason quiet, one client name. Fixture stands in for the scarcity "spots" row.',
    data: {
      ...capacityBase,
      previewScarcity: { ...CAPACITY.statement, counts },
    },
  },
  {
    block: 'proofStrip',
    variant: 'capacity — no reason',
    label: 'fallback: statement without a reason is NOT rendered (no bare number); only the client names show',
    data: {
      ...capacityBase,
      previewScarcity: { ...CAPACITY.statement, reason: '', counts },
    },
  },
  {
    block: 'teamIntro',
    variant: 'founder-card — section',
    label: 'TeamIntro founder-card, presentation "section" (home B): all paragraphs, ink button + more link, card without bio, 4 socials on one line',
    data: {
      variant: 'founder-card',
      ...FOUNDER,
      pullQuote: 'This must not render in the section presentation.',
      member,
    },
  },
]
