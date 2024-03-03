import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";
import { List } from "~/components/pages/index/List";
import { SearchForm } from "~/components/pages/index/SearchForm";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const data = [
    { name: "山田太郎", loginId: "yamada-taro" },
    { name: "田中花子", loginId: "tanaka-hanako" },
    { name: "佐藤一郎", loginId: "sato-ichiro" },
    { name: "鈴木二郎", loginId: "suzuki-jiro" },
    { name: "高橋三郎", loginId: "takahashi-saburo" },
    { name: "田村四郎", loginId: "tamura-shiro" },
    { name: "伊藤五郎", loginId: "ito-goro" },
    { name: "渡辺六郎", loginId: "watanabe-rokuro" },
    { name: "山本七郎", loginId: "yamamoto-shichiro" },
    { name: "中村八郎", loginId: "nakamura-hachiro" },
    { name: "小林九郎", loginId: "kobayashi-kuro" },
  ];
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
