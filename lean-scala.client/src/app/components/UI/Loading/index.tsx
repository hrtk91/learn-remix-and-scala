import { Spinner } from "../Spinner";

export type LoadingProps = {
  open?: boolean;
};

export const Loading = ({ open }: LoadingProps) => {
  return (
    <div
      className={`${open ? "visible" : "invisible"} fixed left-0 top-0 flex h-screen w-screen items-center justify-center backdrop-brightness-75`}
    >
      <Spinner />
    </div>
  );
};
