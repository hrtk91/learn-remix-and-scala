import { Form, useSearchParams } from "@remix-run/react";
import { Search } from "~/components/UI/Icons/Search";
import { Teacher } from "~/components/UI/Icons/Teacher";
import styles from "./SearchForm.module.css";

export const SearchForm = () => {
  const [searchParams] = useSearchParams();

  return (
    <div id="search" className=" flex items-center pb-6">
      <div className="flex grow">
        <Teacher />
        <span className="whitespace-nowrap px-2 text-2xl font-bold">先生</span>
      </div>
      <Form
        name="search"
        className={`${styles.baseFrame} flex focus:border-slate-600 focus:outline-none`}
        method="get"
      >
        <input
          name="name_like"
          type="text"
          placeholder="名前で検索"
          className={`${styles.baseFrameInner} h-full w-full border-none focus:outline-none`}
          defaultValue={searchParams.get("name_like") ?? undefined}
        />
        <button
          aria-label="search-button"
          type="submit"
          className="rounded-full hover:bg-slate-100"
        >
          <Search />
        </button>
      </Form>
    </div>
  );
};
