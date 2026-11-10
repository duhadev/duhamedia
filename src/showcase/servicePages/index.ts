import type { ShowcaseEntry } from '../registry'
import { unitAEntries } from './unitA'
import { unitBEntries } from './unitB'
import { unitCEntries } from './unitC'
import { unitDEntries } from './unitD'
import { unitEEntries } from './unitE'

/** Service pages showcase entries (2026-11-09), one fixture file per build unit so coders never share a file. */
export const servicePagesEntries: ShowcaseEntry[] = [
  ...unitAEntries,
  ...unitBEntries,
  ...unitCEntries,
  ...unitDEntries,
  ...unitEEntries,
]
