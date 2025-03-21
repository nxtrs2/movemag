import type { PoetryItem } from "@/types/magazine";

export function getUniqueAuthors(data: PoetryItem[]): string[] {
  // Filter out empty strings before creating the Set
  const authors = new Set(
    data
      .map((item) => item.author)
      .filter((author) => author && author.trim() !== "")
  );
  return Array.from(authors).sort();
}

export function getUniqueClassrooms(data: PoetryItem[]): string[] {
  // Filter out empty strings before creating the Set
  const classrooms = new Set(
    data
      .map((item) => item.classroom)
      .filter((classroom) => classroom && classroom.trim() !== "")
  );
  return Array.from(classrooms).sort();
}
