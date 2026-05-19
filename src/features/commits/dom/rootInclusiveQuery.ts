export function queryRootAndDescendants<TElement extends HTMLElement = HTMLElement>(
  root: ParentNode,
  selector: string,
): TElement[] {
  return uniqueElements([
    ...(root instanceof HTMLElement && root.matches(selector) ? [root as TElement] : []),
    ...root.querySelectorAll<TElement>(selector),
  ]);
}

export function uniqueElements<TElement extends Element>(elements: TElement[]): TElement[] {
  return [...new Set(elements)];
}
