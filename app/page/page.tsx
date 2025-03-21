import MagazineLayout from "@/components/magazine-layout";
import { poetryData } from "@/data/poetry-data";

export default function Home() {
  return <MagazineLayout poetryData={poetryData} />;
}
