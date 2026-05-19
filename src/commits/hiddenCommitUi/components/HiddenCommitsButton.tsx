import type { ReactNode } from 'react';

import { cn } from '../../../shared/cn';

const BASE_CLASS_NAME = cn(
  'block w-full cursor-pointer text-left text-(--fgColor-muted) hover:underline hover:opacity-100',
);

type Props = {
  className: string;
  style?: React.CSSProperties;
  onClick: () => void;
  children: ReactNode;
};

export function HiddenCommitsButton(props: Props) {
  return (
    <button
      data-git-matter-component
      className={cn(BASE_CLASS_NAME, props.className)}
      style={props.style}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
