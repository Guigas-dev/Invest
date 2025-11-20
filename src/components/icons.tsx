import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <path fill="none" d="M0 0h256v256H0z" />
      <path
        d="M168 40.7a96 96 0 1 1-80 0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <path
        d="M188.3 78.4a32.3 32.3 0 0 1-1.2 57.5L128 176l-59.1-40.1a32.3 32.3 0 0 1-1.2-57.5 32 32 0 0 1 45.2 0L128 93.3l15.1-14.9a32 32 0 0 1 45.2 0Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </svg>
  );
}
