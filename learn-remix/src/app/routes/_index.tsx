import { LoaderFunctionArgs, json } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigation,
  useRouteError,
  useSearchParams,
} from "@remix-run/react";
import { Dialog } from "~/components/UI/Dialog";
import { Loading } from "~/components/UI/Loading";
import { List } from "~/components/pages/routes/List";
import { Pagination } from "~/components/pages/routes/Pagination";
import { SearchForm } from "~/components/pages/routes/SearchForm";

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
  const reqUrl = new URL(process.env.API_URL!);

  if (searchParams.get("name_like")) {
    reqUrl.searchParams.set(k("name_like"), searchParams.get("name_like")!);
  }

  const all: ApiResponseData[] = await fetch(reqUrl).then((r) => r.json());

  // limitの設定
  reqUrl.searchParams.set(
    k("_limit"),
    searchParams.get("_limit") || LIMIT.toString(),
  );

  // pageの設定
  reqUrl.searchParams.set(k("_page"), searchParams.get("_page") || "1");

  // sortの設定(指定がある場合)
  if (searchParams.get("_sort")) {
    reqUrl.searchParams.set(k("_sort"), searchParams.get("_sort") || "name");
  }

  // orderの設定(指定がある場合)
  if (searchParams.get("_order")) {
    reqUrl.searchParams.set(k("_order"), searchParams.get("_order") || "name");
  }

  // 初期表示のデータを取得
  // limit指定して要求すると、1ページ当たりの件数が制限されるのでなく、取得できる全件数が制限される
  const limited: ApiResponseData[] = await fetch(reqUrl).then((r) => r.json());
  console.log("limited:", limited);
  return json({ all, limited });
}

export default function Index() {
  const error = useRouteError();
  const { all, limited } = useLoaderData<typeof loader>() ?? {
    all: [],
    limited: [],
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const { state } = useNavigation();
  const currentPage = Number(searchParams.get(k("_page"))) || 1;
  const limit = Number(searchParams.get(k("_limit"))) || LIMIT;

  return (
    <main className="mx-auto flex h-full flex-col px-4 md:container">
      <SearchForm />
      {all.length ? (
        <>
          <List
            columns={[
              {
                displayName: "名前",
                itemKey: "name",
                onPointerUp: () => {
                  const sort = searchParams.get(k("_sort"));
                  const order = searchParams.get(k("_order"));
                  if (sort === "name") {
                    if (order === "asc") {
                      searchParams.set(k("_order"), "desc");
                    } else if (order === "desc") {
                      searchParams.delete(k("_sort"));
                      searchParams.delete(k("_order"));
                    }
                  } else {
                    searchParams.set(k("_sort"), "name");
                    searchParams.set(k("_order"), "asc");
                  }
                  setSearchParams(searchParams);
                },
                selected: searchParams.get(k("_sort")) === "name",
                sortIcon:
                  searchParams.get(k("_sort")) === "name" &&
                  searchParams.get(k("_order"))
                    ? (searchParams.get(k("_order")) as "asc" | "desc")
                    : undefined,
              },
              {
                displayName: "ログインID",
                itemKey: "loginId",
                onPointerUp: () => {
                  const sort = searchParams.get(k("_sort"));
                  const order = searchParams.get(k("_order"));
                  if (sort === "loginId") {
                    if (order === "asc") {
                      searchParams.set(k("_order"), "desc");
                    } else if (order === "desc") {
                      searchParams.delete(k("_sort"));
                      searchParams.delete(k("_order"));
                    }
                  } else {
                    searchParams.set(k("_sort"), "loginId");
                    searchParams.set(k("_order"), "asc");
                  }
                  setSearchParams(searchParams);
                },
                selected: searchParams.get(k("_sort")) === "loginId",
                sortIcon:
                  searchParams.get(k("_sort")) === "loginId" &&
                  searchParams.get(k("_order"))
                    ? (searchParams.get(k("_order")) as "asc" | "desc")
                    : undefined,
              },
              {
                /** 空列 */
              },
            ]}
            items={limited}
          />
          <Pagination
            data={all}
            countPerPage={limit}
            currentPage={currentPage}
            onClickPage={(next) => {
              searchParams.set(k("_page"), next.toString());
              searchParams.set(k("_limit"), limit.toString());
              setSearchParams(searchParams);
            }}
          />
        </>
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
