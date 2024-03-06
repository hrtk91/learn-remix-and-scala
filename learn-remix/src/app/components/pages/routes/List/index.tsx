import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
} from "react";
import { AngleDown } from "../../../UI/Icons/AngleDown";
import styles from "./List.module.css";

export type ListColumnProps<T extends Record<string, ReactNode>> = {
  displayName?: string;
  itemKey?: keyof T;
  onPointerUp?: (ev: React.PointerEvent<HTMLButtonElement>) => void;
  selected?: boolean;
  sortIcon?: "asc" | "desc";
};

export type ListProps<T extends Record<string, ReactNode>> = {
  columns: ListColumnProps<T>[];
  items: T[];
};

export const List = <T extends Record<string, ReactNode>>({
  columns,
  items,
}: ListProps<T>) => {
  const rows = items.map((i) =>
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
            empty={!c.displayName}
          >
            {c.displayName && (
              <>
                <span className="grow text-left text-xs">{c.displayName}</span>
                <AngleDown
                  className={`${styles["sort-icon"]} ${c.sortIcon === "asc" ? styles.rotate : ""}`}
                  fillOpacity={c.selected ? 1 : 0.5}
                />
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
    </div>
  );
};

type ColumnProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  secondary?: boolean;
  empty?: boolean;
};

const Column = ({
  secondary = false,
  empty = false,
  ...props
}: ColumnProps) => {
  return (
    <div
      className={`${styles.column} ${secondary ? styles.columnSecondary : ""} w-4/12`}
    >
      {!empty && (
        <button
          type="button"
          className={`inline-flex h-full w-full text-white`}
          {...props}
        />
      )}
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
