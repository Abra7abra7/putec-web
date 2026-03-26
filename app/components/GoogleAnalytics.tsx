'use client';

import Script from 'next/script';

export default function GoogleAnalytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  if (!GA_ID) {
    return null;
  }

  return (
    <>
      {/* 
        Google Analytics 4 (gtag.js)
        - type="text/plain" and data-cookieconsent="statistics" are required for Cookiebot 
        to block the script until consent is given.
      */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        type="text/plain"
        data-cookieconsent="statistics"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        type="text/plain"
        data-cookieconsent="statistics"
      >
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
