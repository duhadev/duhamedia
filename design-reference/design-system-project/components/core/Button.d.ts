/**
 * Rectangular, square-cornered action. One primary (accent) per view.
 * @startingPoint section="Core" subtitle="Primary, ghost, and dark actions" viewport="700x180"
 */
export interface ButtonProps {
  /** 'primary' accent fill · 'ghost' ink outline · 'ghost-light' cream outline for dark sections · 'dark' ink fill */
  variant?: 'primary' | 'ghost' | 'ghost-light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  /** renders an <a> when set */
  href?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
