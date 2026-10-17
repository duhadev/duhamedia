/** The three-phase engagement arc as a designed object. The independence handover is always the visible terminal beat. */
export interface PhaseTimelineProps {
  /** override the default Build Foundation → Operate Engine → Build Independence set */
  phases?: {n: string, name: string, desc?: string}[];
  /** index of the phase to highlight in accent (e.g. 0 on the dev page, 1 on marketing) */
  active?: number;
  /** vertical, description-less variant for narrow slots */
  compact?: boolean;
  style?: React.CSSProperties;
}
export declare function PhaseTimeline(props: PhaseTimelineProps): JSX.Element;
