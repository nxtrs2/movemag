import { notFound } from "next/navigation";
import MagazineLayout from "@/components/magazine-layout";
import { poetryData } from "@/data/poetry-data";
import { createSlug } from "@/utils/slugs";

// interface PageProps {
//   params: {
//     pageNumber: string;
//     slug: string;
//   };
// }

type Params = Promise<{ pageNumber: string; slug: string }>;

export default async function PoemPage(props: { params: Params }) {
  const params = props.params;
  const slug = (await params).slug;
  const pageNumber = (await params).pageNumber;

  const page = Number.parseInt(pageNumber, 10);

  // Find the poem by page number (excluding frontmatter and section items)
  const poem = poetryData.find(
    (item) => !item.frontmatter && !item.section && item.pageNumber === page
  );

  // If poem doesn't exist or slug doesn't match, return 404
  if (!poem || createSlug(poem.title) !== slug) {
    notFound();
  }

  return <MagazineLayout poetryData={poetryData} initialSelectedItem={poem} />;
}

// export default PoemPage;

// Generate static paths for all regular poems
export async function generateStaticParams() {
  return poetryData
    .filter((item) => !item.frontmatter && !item.section)
    .map((poem) => ({
      pageNumber: poem.pageNumber?.toString(),
      slug: createSlug(poem.title),
    }));
}
