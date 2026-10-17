/** Archivo Black uppercase headline with exactly one accent-colored phrase — the DEPT/Hero-F treatment. */
export interface AccentHeadlineProps {
  /** full headline text */
  text: string;
  /** substring of `text` rendered in the accent color (the ONE accent element of the view) */
  accent?: string;
  /** 1=H1 2=H2 3=H3 scale */
  level?: 1 | 2 | 3;
  /** rendered tag, default 'h2' */
  as?: string;
  style?: React.CSSProperties;
}
export declare function AccentHeadline(props: AccentHeadlineProps): JSX.Element;
