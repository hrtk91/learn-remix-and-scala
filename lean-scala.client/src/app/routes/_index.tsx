import {
  LoaderFunctionArgs,
  json,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import {
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { useState } from "react";
import { Loading } from "~/components/UI/Loading";
import { List } from "~/components/pages/index/List";
import { SearchForm } from "~/components/pages/index/SearchForm";

export const BASE_URL = new URL(
  "https://us-central1-compass-hr.cloudfunctions.net",
);

const SEARCH_KEYS = [
  "_page" as const,
  "_limit" as const,
  "_sort" as const,
  "_order" as const,
  "name_like" as const,
  "loginId_like" as const,
];

function k(key: (typeof SEARCH_KEYS)[number]) {
  return key;
}

const LIMIT = 20;

export type ApiResponseData = {
  id: string;
  name: string;
  loginId: string;
};

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async ({
  request: { url },
}: LoaderFunctionArgs) => {
  console.log("loader started");
  const searchParams = new URL(url).searchParams;
  const reqUrl = new URL(`${BASE_URL}mock/facilitators`);

  if (searchParams.get("word")) {
    reqUrl.searchParams.set(k("name_like"), searchParams.get("word")!);
    reqUrl.searchParams.set(k("loginId_like"), searchParams.get("word")!);
  }

  if (searchParams.get("_limit")) {
    reqUrl.searchParams.set(
      k("_limit"),
      searchParams.get("_limit") || LIMIT.toString(),
    );
  }

  if (searchParams.get("_page")) {
    reqUrl.searchParams.set(k("_page"), searchParams.get("_page") || "1");
  }

  if (searchParams.get("_sort")) {
    reqUrl.searchParams.set(k("_sort"), searchParams.get("_sort") || "name");
  }

  if (searchParams.get("_order")) {
    reqUrl.searchParams.set(k("_order"), searchParams.get("_order") || "name");
  }

  // 初期表示のデータを取得
  const resp = await fetch(reqUrl).then((r) => r.json());
  return json(resp);
};

export default function Index() {
  const data = useLoaderData<ApiResponseData[]>();
  const [selectedColumn, setSelectedColumn] = useState<
    "name" | "loginId" | undefined
  >();

  const [searchParams] = useSearchParams();

  const { state } = useNavigation();

  return (
    <main className="mx-auto flex h-full flex-col px-4 md:container">
      <SearchForm />
      <List
        columns={[
          {
            displayName: "名前",
            itemKey: "name",
            onPointerUp: () => setSelectedColumn("name"),
            selected: selectedColumn === "name",
          },
          {
            displayName: "ログインID",
            itemKey: "loginId",
            onPointerUp: () => setSelectedColumn("loginId"),
            selected: selectedColumn === "loginId",
          },
          {
            /** 空列 */
          },
        ]}
        items={data}
        limit={Number(searchParams.get("_limit")) || LIMIT}
      />
      <Loading open={state === "loading" || state === "submitting"} />
    </main>
  );
}
