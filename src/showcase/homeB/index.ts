import type { ShowcaseEntry } from '../registry'
import { unitAEntries } from './unitA'
import { unitBEntries } from './unitB'
import { unitCEntries } from './unitC'

/** Home B showcase entries (2026-11-09), one fixture file per build unit so coders never share a file. */
export const homeBEntries: ShowcaseEntry[] = [...unitAEntries, ...unitBEntries, ...unitCEntries]
