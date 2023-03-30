import type {LinksFunction, MetaFunction} from "@remix-run/cloudflare";
import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration,} from "@remix-run/react";
import tailwindCss from './styles/tailwind.css'
import inter from 'inter-ui/inter.css'
import globalCss from './styles/globals.css'

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "steele's website",
    viewport: "width=device-width,initial-scale=1",
    "og:title": "steele's website",
    "og:image": "https://stele.me/steele.jpg",
    description: "hi, i'm steele. i'm a software engineer wanna contact me? email me at me@stele.me",
    "og:description": "hi, i'm steele. i'm a software engineer wanna contact me? email me at me@stele.me",
    "og:color": "#000000",
});

export const links: LinksFunction = () => {
    return [
        {
            rel: "stylesheet",
            href: tailwindCss,
        },
        {
            rel: "stylesheet",
            href: inter,
        },
        {
            rel: "stylesheet",
            href: globalCss,
        }
    ];
};

export default function App() {
    return (
        <html lang="en">
        <head>
            <Meta/>
            <Links/>
        </head>
        <body>
        <Outlet/>
        <ScrollRestoration/>
        <Scripts/>
        <LiveReload/>
        </body>
        </html>
    );
}
