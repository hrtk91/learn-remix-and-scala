import { Teacher } from "~/components/UI/Icons/Teacher";
import styles from "./SearchForm.module.css";
import { Search } from "~/components/UI/Icons/Search";

export const SearchForm = () => {
  return (
    <div id="search" className=" flex items-center pb-6">
      <div className="flex grow">
        <Teacher fill="" />
        <span className="whitespace-nowrap px-2 text-2xl font-bold">先生</span>
      </div>
      <form
        className={`${styles.baseFrame} flex focus:border-slate-600 focus:outline-none`}
      >
        <input
          name="word"
          type="text"
          placeholder="名前、ログインIDで検索"
          className={`${styles.baseFrameInner} h-full w-full border-none focus:outline-none`}
        />
        <button type="submit" className="rounded-full hover:bg-slate-100">
          <Search />
        </button>
      </form>
    </div>
  );
};
