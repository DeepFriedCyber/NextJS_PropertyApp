import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <style dangerouslySetInnerHTML={{ __html: `
          #__next-build-watcher { display: none !important; }
          #__next-prerender-indicator { display: none !important; }
          .__next-build-watcher { display: none !important; }
          .__next-prerender-indicator { display: none !important; }
          .next-build-watcher { display: none !important; }
          .next-prerender-indicator { display: none !important; }
          [data-nextjs-dialog-overlay] { display: none !important; }
          [data-nextjs-dialog] { display: none !important; }
          [data-nextjs-toast] { display: none !important; }
          [data-nextjs-toast-wrapper] { display: none !important; }
        ` }} />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script dangerouslySetInnerHTML={{ __html: `
          window.addEventListener('load', function() {
            const elements = document.querySelectorAll('[id^="__next-"], [class^="__next-"]');
            elements.forEach(function(element) {
              if (element.id !== '__next') {
                element.style.display = 'none';
              }
            });
          });
        `}} />
      </body>
    </Html>
  )
}
