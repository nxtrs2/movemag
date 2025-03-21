import { notFound } from "next/navigation";
import MagazineLayout from "@/components/magazine-layout";
import { poetryData } from "@/data/poetry-data";
import { createSlug } from "@/utils/slugs";

// interface SectionPageProps {
//   params: {
//     slug: string;
//   };
// }

type Params = Promise<{ slug: string }>;

export default async function SectionPage(props: { params: Params }) {
  const params = props.params;
  const slug = (await params).slug;
  const item = poetryData.find(
    (item) => item.section && createSlug(item.title) === slug
  );

  // If item doesn't exist, return 404
  if (!item) {
    notFound();
  }

  return <MagazineLayout poetryData={poetryData} initialSelectedItem={item} />;
}

// export default SectionPage;

// Generate static paths for all section items
export async function generateStaticParams() {
  return poetryData
    .filter((item) => item.section)
    .map((item) => ({
      slug: createSlug(item.title),
    }));
}
