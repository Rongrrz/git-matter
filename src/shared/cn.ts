// Unfortunately, this file must be outside of utils as
// oxfmt can recognize "cn" but cannot recognize "Utils.cn".

import { twMerge } from 'tailwind-merge';

export function cn(...classNames: string[]): string {
  return twMerge(...classNames);
}
