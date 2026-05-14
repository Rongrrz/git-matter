import { twMerge } from "tailwind-merge";

/**
 * Merges class names and removes falsy values.
 *
 * string -> normal class name
 * false -> conditional class from `condition && "class"`
 * null -> conditional class from `condition ? "class" : null`
 * undefined -> optional className prop
 *
 * Later Tailwind classes override earlier conflicting ones.
 */
export function mergeClassNames(
  ...classes: (string | false | null | undefined)[]
): string {
  const filteredClasses = classes.filter(Boolean).join(" ");
  return twMerge(filteredClasses);
}
