import type { FC } from "react";
import { notFound } from "next/navigation";
import MagazineLayout from "@/components/magazine-layout";
import { poetryData } from "@/data/poetry-data";
import { createSlug } from "@/utils/slugs";

interface PageProps {
  params: {
    pageNumber: string;
    slug: string;
  };
}

const PoemPage: FC<PageProps> = ({ params }) => {
  const pageNumber = Number.parseInt(params.pageNumber, 10);

  // Find the poem by page number (excluding frontmatter and section items)
  const poem = poetryData.find(
    (item) =>
      !item.frontmatter && !item.section && item.pageNumber === pageNumber
  );

  // If poem doesn't exist or slug doesn't match, return 404
  if (!poem || createSlug(poem.title) !== params.slug) {
    notFound();
  }

  return <MagazineLayout poetryData={poetryData} initialSelectedItem={poem} />;
};

export default PoemPage;

// Generate static paths for all regular poems
export async function generateStaticParams() {
  return poetryData
    .filter((item) => !item.frontmatter && !item.section)
    .map((poem) => ({
      pageNumber: poem.pageNumber.toString(),
      slug: createSlug(poem.title),
    }));
}
