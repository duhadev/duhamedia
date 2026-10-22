/** Join class names, skipping falsy values. (No tailwind-merge: pass conflicting utilities via props, not className.) */
export const cx = (...classes: (string | false | null | undefined)[]): string => classes.filter(Boolean).join(' ')
