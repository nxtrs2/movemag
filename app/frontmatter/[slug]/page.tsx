import type { FC } from "react";
import { notFound } from "next/navigation";
import MagazineLayout from "@/components/magazine-layout";
import { poetryData } from "@/data/poetry-data";
import { createSlug } from "@/utils/slugs";

interface FrontmatterPageProps {
  params: {
    slug: string;
  };
}

const FrontmatterPage: FC<FrontmatterPageProps> = ({ params }) => {
  // Find the frontmatter item by slug
  const item = poetryData.find(
    (item) => item.frontmatter && createSlug(item.title) === params.slug
  );

  // If item doesn't exist, return 404
  if (!item) {
    notFound();
  }

  return <MagazineLayout poetryData={poetryData} initialSelectedItem={item} />;
};

export default FrontmatterPage;

// Generate static paths for all frontmatter items
export async function generateStaticParams() {
  return poetryData
    .filter((item) => item.frontmatter)
    .map((item) => ({
      slug: createSlug(item.title),
    }));
}
