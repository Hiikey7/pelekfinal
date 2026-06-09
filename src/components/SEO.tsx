import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://pelekproperties.co.ke";
const SITE_NAME = "Pelek Properties";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.svg`;

const routeMeta: Record<
  string,
  {
    title: string;
    description: string;
    keywords?: string;
    noindex?: boolean;
  }
> = {
  "/": {
    title: "Pelek Properties | Luxury Airbnb, Rentals & Property Sales in Kenya",
    description:
      "Discover premium Airbnb stays, rentals, and properties for sale across Kenya. Book stays, compare rentals, and find property opportunities with Pelek Properties.",
    keywords:
      "Airbnb Kenya, rentals Kenya, property for sale Kenya, luxury stays Kenya, Nairobi Airbnb, Kenya real estate",
  },
  "/properties": {
    title: "Properties in Kenya | Airbnb, Rentals & Homes for Sale",
    description:
      "Browse Pelek Properties listings for short-stay Airbnb homes, long-term rentals, and property sales across Kenya.",
    keywords:
      "properties Kenya, houses for rent Kenya, Airbnb Nairobi, Kenya property sales, furnished rentals Kenya",
  },
  "/services": {
    title: "Property Management, Rentals & Real Estate Services in Kenya",
    description:
      "Explore Pelek Properties services for property management, real estate sales, valuations, Airbnb hosting, and commercial property solutions.",
  },
  "/blog": {
    title: "Kenya Property Guides & Travel Stay Tips | Pelek Blog",
    description:
      "Read practical guides on Kenya rentals, Airbnb stays, real estate buying, property management, and local property market insights.",
  },
  "/faq": {
    title: "Frequently Asked Questions | Pelek Properties",
    description:
      "Answers to common questions about booking stays, listing properties, rentals, sales, and working with Pelek Properties.",
  },
  "/contact": {
    title: "Contact Pelek Properties | Bookings, Rentals & Property Help",
    description:
      "Contact Pelek Properties for Airbnb bookings, rental enquiries, property sales, management services, and real estate support in Kenya.",
  },
  "/favorites": {
    title: "Saved Properties | Pelek Properties",
    description: "Review the Pelek Properties listings you have saved.",
    noindex: true,
  },
  "/terms": {
    title: "Terms & Conditions | Pelek Properties",
    description: "Review Pelek Properties terms and conditions.",
  },
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

function currentMeta(pathname: string) {
  if (pathname.startsWith("/property/")) {
    return {
      title: "Property Details | Pelek Properties",
      description:
        "View property photos, pricing, location, amenities, and booking details from Pelek Properties.",
    };
  }

  if (pathname.startsWith("/blog/")) {
    return {
      title: "Property Article | Pelek Properties Blog",
      description:
        "Read property, travel, rental, and real estate insights from Pelek Properties.",
    };
  }

  if (pathname.startsWith("/admin")) {
    return {
      title: "Admin | Pelek Properties",
      description: "Pelek Properties admin area.",
      noindex: true,
    };
  }

  return routeMeta[pathname] || routeMeta["/"];
}

export default function SEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = currentMeta(pathname);
    const canonical = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;

    document.title = meta.title;
    document.documentElement.lang = "en-KE";

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: meta.description,
    });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: meta.noindex ? "noindex, nofollow" : "index, follow",
    });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: meta.title,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: meta.description,
    });
    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonical,
    });
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: DEFAULT_IMAGE,
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: meta.title,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: meta.description,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: DEFAULT_IMAGE,
    });
    upsertLink('link[rel="canonical"]', {
      rel: "canonical",
      href: canonical,
    });

    if (meta.keywords) {
      upsertMeta('meta[name="keywords"]', {
        name: "keywords",
        content: meta.keywords,
      });
    }
  }, [pathname]);

  return null;
}
