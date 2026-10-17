/** Accordion row for objection-handling FAQ blocks. Hairline-divided, + toggles to accent ×. */
export interface FAQItemProps {
  question: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}
export declare function FAQItem(props: FAQItemProps): JSX.Element;
