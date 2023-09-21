import { readFileSync } from "fs";
import { join } from "path";
import { Head, Html, Main, NextScript } from "next/document";
import Document from "next/document";

class InlineStylesHead extends Head {
  getCssLinks() {
    return this.__getInlineStyles();
  }

  __getInlineStyles() {
    const { assetPrefix, files } = this.context;

    return (
      <>
        {false && (
          <style
            key={"tailwindSSR"}
            data-href={`${assetPrefix}/_next/static/tailwindSSR.css`}
            dangerouslySetInnerHTML={{
              __html: readFileSync(
                join(process.cwd(), "styles", "tailwindSSR.css"),
                "utf-8",
              ),
            }}
          />
        )}
        {!(!files || files.length === 0) &&
          files
            .filter((file) => /\.css$/.test(file))
            .map((file) => (
              <style
                key={file}
                data-href={`${assetPrefix}/_next/${file}`}
                dangerouslySetInnerHTML={{
                  __html: readFileSync(
                    join(process.cwd(), ".next", file),
                    "utf-8",
                  ),
                }}
              />
            ))}
      </>
    );
  }
}

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" dir="ltr">
        <InlineStylesHead>
          <meta name="theme-color" content="#ffcc66" />
        </InlineStylesHead>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
