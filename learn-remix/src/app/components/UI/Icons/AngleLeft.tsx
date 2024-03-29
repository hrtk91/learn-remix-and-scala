import { SVGProps } from "react";

export const AngleLeft = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="m9.243 12.781-4.25-4.25a.748.748 0 0 1 .003-1.062l4.25-4.25a.747.747 0 0 1 1.06 0l.703.712a.747.747 0 0 1 0 1.06L7.996 8.003l3.013 3.013a.747.747 0 0 1 0 1.059l-.706.706a.747.747 0 0 1-1.06 0z"
        fill="#212423"
        fillRule="nonzero"
      />
    </svg>
  );
};
