import { AngleLeft } from "~/components/UI/Icons/AngleLeft";
import styles from "./Pagination.module.css";
import { AngleRight } from "~/components/UI/Icons/AngleRight";

export type PaginationProps = {
  data: unknown[];
  countPerPage: number;
  currentPage?: number;
  onClickPage?: (nextPageNumber: number) => void;
};

export const Pagination = ({
  data,
  countPerPage,
  currentPage = 1,
  onClickPage,
}: PaginationProps) => {
  const totalCount = data.length;

  const chunks = data.reduce(
    (acc: unknown[][], cur, idx) => {
      if (idx === 0) {
        return [[cur]];
      }

      const pageIdx = Math.floor(idx / countPerPage);
      if (idx % countPerPage !== 0) {
        acc[pageIdx] = [...acc[pageIdx], cur];
        return acc;
      } else {
        return [...acc, [cur]];
      }
    },
    [[]],
  );

  return (
    <div id="pagination-container" className="flex justify-start px-2 py-4">
      <div className="grow text-sm">{`${totalCount}件中 ${Math.max(currentPage * countPerPage - countPerPage, totalCount > 0 ? 1 : 0)}~${Math.min(currentPage * countPerPage, totalCount)}件を表示`}</div>
      <div id="pagination" className="flex">
        {chunks.length > 0 && (
          <>
            <div
              className={`mx-2 ${styles.back} ${currentPage === 1 ? "opacity-30" : ""}`}
            >
              <button
                aria-label="prev-page"
                type="button"
                className="flex h-full w-full items-center justify-center"
                disabled={currentPage === 1}
                onPointerUp={() => {
                  if (1 < currentPage) {
                    onClickPage?.(currentPage - 1);
                  }
                }}
              >
                <AngleLeft />
              </button>
            </div>
            {chunks
              .map((_, idx) => idx + 1)
              .slice(
                Math.max(0, Math.min(currentPage - 3, chunks.length - 5)),
                Math.min(Math.max(currentPage + 2, 5), chunks.length),
              )
              .map((pageNumber) => (
                <Page
                  key={pageNumber}
                  num={pageNumber}
                  selected={pageNumber === currentPage}
                  onPointerUp={(pageNumber) => {
                    onClickPage?.(pageNumber);
                  }}
                />
              ))}
            <div
              className={`mx-1 ${styles.next} ${currentPage === chunks.length ? "opacity-30" : ""}`}
            >
              <button
                aria-label="next-page"
                type="button"
                className="flex h-full w-full items-center justify-center"
                disabled={currentPage === chunks.length}
                onPointerUp={() => {
                  if (currentPage < chunks.length) {
                    onClickPage?.(currentPage + 1);
                  }
                }}
              >
                <AngleRight />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

type PageProps = {
  num: number;
  selected?: boolean;
  onPointerUp?: (pageNumber: number) => void;
};

const Page = ({ num, selected, onPointerUp }: PageProps) => {
  return (
    <div className={`mx-1 ${selected ? styles.pageSelected : styles.page}`}>
      <button
        aria-label={`page-${num}`}
        className="h-full w-full"
        type="button"
        onPointerUp={() => onPointerUp?.(num)}
      >
        {num}
      </button>
    </div>
  );
};
