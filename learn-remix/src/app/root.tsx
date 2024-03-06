import { cssBundleHref } from "@remix-run/css-bundle";
import { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import tailwind from "./tailwind.css";
import styles from "./root.module.css";
import { Logo } from "./components/UI/Icons/Logo";
import { Account } from "./components/UI/Icons/Account";

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "stylesheet", href: tailwind },
];

export default function App() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className={`${styles.base} flex`}>
          <div className="flex grow">
            <div className={`${styles.logowhite}`}>
              <Logo />
            </div>
            <button
              type="button"
              className={`${styles.Rectangle} whitespace-nowrap text-white`}
            >
              アカウント管理
            </button>
          </div>
          <button className="flex items-center justify-self-end px-4 text-white">
            <Account />
            <span className="whitespace-nowrap pl-2">因幡深雪</span>
          </button>
        </div>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
