import { ReactNode } from "react";

export type DialogProps = {
  open?: boolean;
  children?: ReactNode;
};

export const Dialog = ({ open, children }: DialogProps) => {
  return (
    <div
      className={`${open ? "visible" : "invisible"} fixed left-0 top-0 z-10 flex h-screen w-screen items-center justify-center backdrop-blur backdrop-brightness-75`}
    >
      <div className="bg-white p-6">{children}</div>
    </div>
  );
};
