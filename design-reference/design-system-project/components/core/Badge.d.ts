/** Pill badge — the one rounded element in the system. Used for the hero authority badge and status labels. */
export interface BadgeProps {
  tone?: 'outline' | 'fill' | 'accent';
  /** optional leading icon node (Phosphor Bold <i>) */
  icon?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
