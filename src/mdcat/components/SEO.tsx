/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Helmet } from "react-helmet-async";

const SITE_NAME = "Zaheen MDCAT Prep";
const BASE_URL = "https://www.zaheen.com.pk/mdcat";
const DEFAULT_IMAGE = "https://www.zaheen.com.pk/mdcat-og-image.jpg"; // swap for a real hosted image once you have one

interface SEOProps {
  title: string;
  description: string;
  path: string; // e.g. "/past-papers" or "/study-notes/biology/bio-ch1" — relative to /mdcat
  noIndex?: boolean; // for pages you don't want search engines to index (e.g. an active quiz session)
  structuredData?: object; // optional JSON-LD schema object (e.g. FAQPage)
}

export default function SEO({ title, description, path, noIndex = false, structuredData }: SEOProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, follow" />}

      {/* Open Graph (WhatsApp, Facebook, LinkedIn previews) */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={DEFAULT_IMAGE} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_IMAGE} />

      {/* Structured data (JSON-LD) — e.g. FAQPage schema */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}