import type { PoetryItem } from "@/types/magazine";

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .trim(); // Remove leading/trailing spaces
}

export function getPoetryItemPath(item: PoetryItem): string {
  const titleSlug = createSlug(item.title);

  if (item.frontmatter) {
    return `/frontmatter/${titleSlug}`;
  } else if (item.section) {
    return `/section/${titleSlug}`;
  } else {
    return `/page/${item.pageNumber}/${titleSlug}`;
  }
}

export function getItemTypeFromPath(
  path: string
): "frontmatter" | "section" | "page" | null {
  if (path.startsWith("/frontmatter/")) {
    return "frontmatter";
  } else if (path.startsWith("/section/")) {
    return "section";
  } else if (path.startsWith("/page/")) {
    return "page";
  }
  return null;
}
