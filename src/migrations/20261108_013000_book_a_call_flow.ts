import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

import { patchPage, report, type PagePatch, type PatchCtx } from '../lib/contentPatch'

/**
 * /book-a-call becomes hero + ONE white stepped widget (owner brief 2026-11-08).
 * Needs 20261108_011914_book_a_call_flow_schema (the `flow` group on BookingEmbed).
 *
 * Moves the page's live copy into layout[1].flow, word for word:
 * - layout[2] formEmbed (pre-call homework) → flow.homework* (same form id)
 * - layout[3] phaseTimeline (What happens next) → flow.nextHeading + nextSteps
 * - layout[5] miniCTAStrip ("Have a quick question first?") → flow.questionText/Link
 * then removes layout[2..5]; layout[4] testimonialRow rendered nothing (no
 * published testimonials) and is dropped. layout[0] (hero) is not touched.
 * Guards match the production snapshot (2026-11-08); a page that differs is skipped.
 */

const CONTEXT = { disableRevalidate: true, bookACallFlow: true }

const strip = <T extends Record<string, unknown>>(obj: T | null | undefined) => {
  if (!obj) return null
  const { id: _id, ...rest } = obj
  return rest
}

const PATCH: PagePatch = {
  slug: 'book-a-call',
  expect: { 0: 'hero', 1: 'bookingEmbed', 2: 'formEmbed', 3: 'phaseTimeline', 4: 'testimonialRow', 5: 'miniCTAStrip' },
  ops: [
    [
      'fn',
      (doc: any) => {
        const [booking, homework, timeline, , question] = doc.layout.slice(1, 6)
        const formId = typeof homework.form === 'object' && homework.form !== null ? homework.form.id : homework.form
        booking.flow = {
          enabled: true,
          bookLabel: 'Book',
          homeworkLabel: 'Homework',
          nextLabel: "What's next",
          bookedLabel: "I've booked my call",
          backLabel: 'Back',
          questionText: question.text ?? null,
          questionLink: strip(question.link),
          homeworkForm: formId ?? null,
          homeworkEyebrow: homework.eyebrow ?? null,
          homeworkHeading: homework.heading ?? null,
          homeworkBody: homework.body ?? null,
          homeworkSubmitLabel: homework.submitLabel ?? null,
          nextHeading: timeline.heading ?? null,
          nextBody: timeline.intro ?? null,
          nextSteps: (timeline.steps ?? []).map((s: any) => ({ title: s.title, detail: s.detail ?? null })),
        }
        doc.layout.splice(2, 4)
      },
    ],
  ],
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  req.context = { ...req.context, ...CONTEXT }
  const c: PatchCtx = { payload, req, context: CONTEXT, done: [], skipped: [] }
  await patchPage(c, PATCH)
  report(c, 'book-a-call flow')
}

// Never delete or roll back content; version history holds the previous layout.
export async function down(_args: MigrateDownArgs): Promise<void> {}
