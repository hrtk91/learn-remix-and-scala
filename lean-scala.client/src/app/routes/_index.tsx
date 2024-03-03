import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { List } from "~/components/pages/index/List";
import { SearchForm } from "~/components/pages/index/SearchForm";

const baseUrl = new URL("https://us-central1-compass-hr.cloudfunctions.net");

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async () => {
  // 初期表示のデータを取得
  const resp = await fetch(baseUrl + "mock/facilitators").then((r) => r.json());
  return json(resp);
};

type ApiResponseData = {
  id: string;
  name: string;
  loginId: string;
};

export default function Index() {
  const data = useLoaderData<ApiResponseData[]>();
  const [selectedColumn, setSelectedColumn] = useState<
    "name" | "loginId" | undefined
  >();
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
        limit={3}
      />
    </main>
  );
}
