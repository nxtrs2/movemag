import type { FC } from "react";
import { notFound } from "next/navigation";
import MagazineLayout from "@/components/magazine-layout";
import { poetryData } from "@/data/poetry-data";
import { createSlug } from "@/utils/slugs";

interface SectionPageProps {
  params: {
    slug: string;
  };
}

const SectionPage: FC<SectionPageProps> = ({ params }) => {
  // Find the section item by slug
  const item = poetryData.find(
    (item) => item.section && createSlug(item.title) === params.slug
  );

  // If item doesn't exist, return 404
  if (!item) {
    notFound();
  }

  return <MagazineLayout poetryData={poetryData} initialSelectedItem={item} />;
};

export default SectionPage;

// Generate static paths for all section items
export async function generateStaticParams() {
  return poetryData
    .filter((item) => item.section)
    .map((item) => ({
      slug: createSlug(item.title),
    }));
}
