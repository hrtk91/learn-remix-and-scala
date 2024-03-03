import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigation,
  useRouteError,
  useSearchParams,
} from "@remix-run/react";
import { useState } from "react";
import { Dialog } from "~/components/UI/Dialog";
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

export function meta() {
  return [
    { title: "lean-scala.client" },
    { name: "description", content: "Welcome to Remix!" },
  ];
}

export async function loader({ request: { url } }: LoaderFunctionArgs) {
  console.log("loader started");
  const searchParams = new URL(url).searchParams;
  const reqUrl = new URL(`${BASE_URL}mock/facilitators`);

  if (searchParams.get("word")) {
    reqUrl.searchParams.set(k("name_like"), searchParams.get("word")!);
    reqUrl.searchParams.set(k("loginId_like"), searchParams.get("word")!);
  }

  if (searchParams.get("_limit")) {
    reqUrl.searchParams.set(k("_limit"), searchParams.get("_limit") ?? "");
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
  // limit指定して要求すると、1ページ当たりの件数が制限されるのでなく、取得できる全件数が制限される
  const resp = await fetch(reqUrl).then((r) => r.json());
  console.log("resp:", resp);
  return json(resp);
}

export default function Index() {
  const error = useRouteError();
  const data = useLoaderData<ApiResponseData[]>() ?? [];
  const [selectedColumn, setSelectedColumn] = useState<
    "name" | "loginId" | undefined
  >();

  const [searchParams] = useSearchParams();

  const { state } = useNavigation();

  return (
    <main className="mx-auto flex h-full flex-col px-4 md:container">
      <SearchForm />
      {data.length ? (
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
      ) : (
        <span className="pl-4">該当するデータはありません</span>
      )}

      <Loading open={state === "loading" || state === "submitting"} />
      <Dialog open={!!error}>
        <Form method="get">
          <div className="pb-12 text-lg">通信エラーが発生しました。</div>
          <div className="flex justify-end">
            <button
              aria-label="retry-button"
              type="submit"
              className="rounded-sm bg-green-600 px-4 py-1 text-sm text-white"
            >
              リトライ
            </button>
          </div>
        </Form>
      </Dialog>
    </main>
  );
}

export function ErrorBoundary() {
  return <Index />;
}
