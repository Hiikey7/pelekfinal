import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://pelekproperties.co.ke";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.svg`;

type PageSEOProps = {
  title: string;
  description: string;
  image?: string;
  noindex?: boolean;
};

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => element?.setAttribute(key, value));
}

function upsertLink(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector<HTMLLinkElement>(selector);

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attrs).forEach(([key, value]) => element?.setAttribute(key, value));
}

export default function PageSEO({
  title,
  description,
  image = DEFAULT_IMAGE,
  noindex = false,
}: PageSEOProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    const canonical = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;

    document.title = title;
    upsertMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: noindex ? "noindex, nofollow" : "index, follow",
    });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonical,
    });
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: image,
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: image,
    });
    upsertLink('link[rel="canonical"]', {
      rel: "canonical",
      href: canonical,
    });
  }, [description, image, noindex, pathname, title]);

  return null;
}
