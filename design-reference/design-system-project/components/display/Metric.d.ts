/** A number as a typographic event — Archivo Black numeral + uppercase label + quiet reason. */
export interface MetricProps {
  /** the numeral, e.g. "3.2×", "$1.4M", "+212%" */
  value: string;
  /** uppercase label under the numeral */
  label?: string;
  /** quiet supporting line (warm gray) — the reason behind an urgency/capacity claim */
  sub?: string;
  /** wine-colored numeral — at most one accent metric per view */
  accent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}
export declare function Metric(props: MetricProps): JSX.Element;

/** Horizontal band of Metrics on a light-gray or ink panel — the launch-state proof fallback. */
export interface MetricStripProps {
  items: MetricProps[];
  dark?: boolean;
  style?: React.CSSProperties;
}
export declare function MetricStrip(props: MetricStripProps): JSX.Element;
