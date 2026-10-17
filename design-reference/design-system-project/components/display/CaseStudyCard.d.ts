/** Case-study proof card — metric-first, dashboard-screenshot imagery. CMS-toggleable at launch: falls back to Testimonial/MetricStrip, never fake studies. */
export interface CaseStudyCardProps {
  client: string;
  /** headline result numeral, e.g. "+212%" */
  metric: string;
  metricLabel: string;
  summary?: string;
  href?: string;
  /** dashboard/UI screenshot url; dark placeholder frame if absent */
  image?: string;
  /** 4:3 media frame for staggered grids */
  tall?: boolean;
  style?: React.CSSProperties;
}
export declare function CaseStudyCard(props: CaseStudyCardProps): JSX.Element;
