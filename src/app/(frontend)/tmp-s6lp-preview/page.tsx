/* eslint-disable */
// @ts-nocheck
import { ProofStripBlock } from '@/blocks/ProofStrip/Component'
import { MiniCTAStripBlock } from '@/blocks/MiniCTAStrip/Component'

export const dynamic = 'force-dynamic'
const L = (label: string) => ({ type: 'custom', url: '/book-a-call', label, newTab: false })
const logos = { show: true, eyebrow: "Stores we've run numbers for", source: 'flagged' }

export default async function Page() {
  return (
    <main>
      <div id="base-proof-scarcity">
        <ProofStripBlock blockType="proofStrip" variant="scarcity" statements={[{ key: 'capacity' }]} pricingNote="Builds start at $5K" logos={logos} />
      </div>
      <div id="base-mini-band"><MiniCTAStripBlock blockType="miniCTAStrip" variant="band" text="One team. One dashboard." link={L('Book a call')} /></div>
      <div id="base-mini-inline"><MiniCTAStripBlock blockType="miniCTAStrip" variant="inline" text="Quick question?" link={L('Contact us')} /></div>
    </main>
  )
}
