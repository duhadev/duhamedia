/** Uppercase letter-spaced label preceding headlines. */
export interface EyebrowProps {
  /** warm-gray instead of inheriting text color */
  muted?: boolean;
  /** small pale-yellow diamond tick before the text (ground-accent detail) */
  tick?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Eyebrow(props: EyebrowProps): JSX.Element;
