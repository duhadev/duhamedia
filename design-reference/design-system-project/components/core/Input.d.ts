/** Text input / textarea with uppercase label. 2px ink border, accent on focus. */
export interface InputProps {
  label?: string;
  type?: string;
  /** render a textarea instead */
  textarea?: boolean;
  /** cream border/text for dark sections */
  dark?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
