import { backend } from "@/integrations/backend/client";
import type { Tables } from "@/integrations/backend/types";

export const publicQueryOptions = {
  staleTime: 5 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
  refetchOnWindowFocus: false,
} as const;

type Property = Tables<"properties">;
type Blog = Tables<"blogs">;
type Review = Tables<"reviews">;

export function propertySlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readData<T>(data: T | null, fallback: T) {
  return data ?? fallback;
}

export async function fetchProperties() {
  const { data } = await backend
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  return readData<Property[]>(data, []);
}

export async function fetchFeaturedProperties() {
  const { data } = await backend
    .from("properties")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });

  return readData<Property[]>(data, []);
}

export async function fetchProperty(slugOrId: string) {
  const { data: propertyById } = await backend
    .from("properties")
    .select("*")
    .eq("id", slugOrId)
    .single();

  if (propertyById) return propertyById as Property;

  const { data } = await backend
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  return readData<Property[]>(data, []).find((property) => propertySlug(property.title) === slugOrId) ?? null;
}

export async function fetchOtherProperties(id: string) {
  const { data } = await backend
    .from("properties")
    .select("*")
    .neq("id", id)
    .limit(10);

  return readData<Property[]>(data, []);
}

export async function fetchBlogs() {
  const { data } = await backend
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  return readData<Blog[]>(data, []);
}

export async function fetchHomepageBlogs() {
  const { data } = await backend
    .from("blogs")
    .select("*")
    .eq("show_on_homepage", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return readData<Blog[]>(data, []);
}

export async function fetchBlog(id: string) {
  const { data } = await backend
    .from("blogs")
    .select("*")
    .eq("id", id)
    .single();

  return data as Blog | null;
}

export async function fetchReviews() {
  const { data } = await backend
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  return readData<Review[]>(data, []);
}
