import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
  useState,
} from "react";
import { AngleDown } from "../../../UI/Icons/AngleDown";
import styles from "./List.module.css";
import { AngleLeft } from "~/components/UI/Icons/AngleLeft";
import { AngleRight } from "~/components/UI/Icons/AngleRight";

export type ListColumnProps<T extends Record<string, ReactNode>> = {
  displayName?: string;
  itemKey?: keyof T;
  onPointerUp?: (ev: React.PointerEvent<HTMLButtonElement>) => void;
  selected?: boolean;
};

export type ListProps<T extends Record<string, ReactNode>> = {
  columns: ListColumnProps<T>[];
  items: T[];
  limit?: number;
};

export const List = <T extends Record<string, ReactNode>>({
  columns,
  items,
  limit = 10,
}: ListProps<T>) => {
  const chunks = items.reduce(
    (acc, cur, idx) => {
      if (idx === 0) {
        return [[cur]];
      }

      const pageIdx = idx > 0 ? Math.floor(idx / limit) : 0;
      if (idx % limit !== 0) {
        acc[pageIdx] = [...acc[pageIdx], cur];
        return acc;
      } else {
        return [...acc, [cur]];
      }
    },
    [[]] as T[][],
  );
  const [currentPage, setCurrentPage] = useState(1);

  const rows = chunks[currentPage - 1].map((i) =>
    columns.map(({ itemKey }) => (itemKey != null ? i[itemKey] : "")),
  );
  return (
    <div id="list" className="flex grow flex-col">
      <div id="list-header" className="flex">
        {columns.map((c, idx) => (
          <Column
            key={idx}
            onPointerUp={(ev) => {
              c.onPointerUp?.(ev);
            }}
            secondary={!c.selected}
          >
            {c.displayName && (
              <>
                <span className="grow text-left text-xs">{c.displayName}</span>
                <AngleDown fillOpacity={c.selected ? 1 : 0.5} />
              </>
            )}
          </Column>
        ))}
      </div>
      <div id="list-body" className="flex grow flex-col">
        {rows.map((row, idx) => (
          <Row key={idx} even={idx % 2 !== 0}>
            {row.map((item, idx) => (
              <Item key={idx}>
                <span className="grow text-left">{item}</span>
              </Item>
            ))}
          </Row>
        ))}
      </div>
      <div id="list-footer" className="flex justify-start px-2 py-4">
        <div className="grow text-sm">{`${items.length}件中 ${Math.max(currentPage * limit - limit, 1)}~${Math.min(currentPage * limit, items.length)}件を表示`}</div>
        <div id="pagination" className="flex">
          {chunks.length > 0 && (
            <>
              <div
                className={`mx-2 ${styles.back} ${currentPage === 1 ? "opacity-30" : ""}`}
              >
                <button
                  type="button"
                  className="flex h-full w-full items-center justify-center"
                  disabled={currentPage === 1}
                  onPointerUp={() => {
                    if (1 < currentPage) {
                      setCurrentPage(currentPage - 1);
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
                    onPointerUp={(pageNumber) => setCurrentPage(pageNumber)}
                  />
                ))}
              <div
                className={`mx-1 ${styles.next} ${currentPage === chunks.length ? "opacity-30" : ""}`}
              >
                <button
                  type="button"
                  className="flex h-full w-full items-center justify-center"
                  disabled={currentPage === chunks.length}
                  onPointerUp={() => {
                    if (currentPage < chunks.length) {
                      setCurrentPage(currentPage + 1);
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
    </div>
  );
};

type ColumnProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  secondary?: boolean;
};

const Column = ({ secondary = false, ...props }: ColumnProps) => {
  return (
    <div
      className={`${styles.column} ${secondary ? styles.columnSecondary : ""} w-4/12`}
    >
      <button
        type="button"
        className={`inline-flex h-full w-full text-white`}
        {...props}
      />
    </div>
  );
};

type RowProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  even?: boolean;
};

const Row = ({ even = false, ...props }: RowProps) => {
  return (
    <div
      className={`flex items-center ${even ? styles.rowEven : ""} ${styles.row}`}
      {...props}
    />
  );
};

const Item = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
) => {
  return <div className="flex w-4/12 justify-center px-2" {...props} />;
};

type PageProps = {
  num: number;
  selected?: boolean;
  onPointerUp?: (pageNumber: number) => void;
};

const Page = ({ num, selected, onPointerUp }: PageProps) => {
  return (
    <div className={`mx-1 ${selected ? styles.pageSelected : styles.page}`}>
      <button type="button" onPointerUp={() => onPointerUp?.(num)}>
        {num}
      </button>
    </div>
  );
};
