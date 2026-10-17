/** Text testimonial block — the launch-state proof unit. Accent top rule, gray or ink panel. */
export interface TestimonialProps {
  quote: string;
  name: string;
  role?: string;
  dark?: boolean;
  style?: React.CSSProperties;
}
export declare function Testimonial(props: TestimonialProps): JSX.Element;
