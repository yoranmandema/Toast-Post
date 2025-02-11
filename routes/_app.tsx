import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>toast-post</title>
        <link rel="stylesheet" href="/styles.css" />
        <link rel="stylesheet" href="/styles/fonts.css" />
      </head>
      <body class="bg-slate-950 flex flex-col h-full">
        <Component />
      </body>
    </html>
  );
}
