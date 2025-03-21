"use client";

import { type FC, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Header from "./header";
import Sidebar from "./sidebar";
import ContentDisplay from "./content-display";
import type { PoetryItem } from "@/types/magazine";
import { getUniqueAuthors, getUniqueClassrooms } from "@/utils/filters";
import { useMobileMenu } from "@/hooks/use-mobile-menu";
import { getPoetryItemPath, getItemTypeFromPath } from "@/utils/slugs";

interface MagazineLayoutProps {
  poetryData: PoetryItem[];
  initialSelectedItem?: PoetryItem | null;
}

const MagazineLayout: FC<MagazineLayoutProps> = ({
  poetryData,
  initialSelectedItem = null,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedItem, setSelectedItem] = useState<PoetryItem | null>(
    initialSelectedItem || (poetryData.length > 0 ? poetryData[0] : null)
  );
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([]);
  const { isOpen, toggle, close } = useMobileMenu();

  const uniqueAuthors = getUniqueAuthors(poetryData);
  const uniqueClassrooms = getUniqueClassrooms(poetryData);

  // Update URL when selected item changes
  useEffect(() => {
    if (!selectedItem) return;

    const path = getPoetryItemPath(selectedItem);
    const currentItemType = getItemTypeFromPath(pathname);

    // Only update URL if we're on a different item type or the specific item has changed
    if (
      (selectedItem.frontmatter && currentItemType !== "frontmatter") ||
      (selectedItem.section && currentItemType !== "section") ||
      (!selectedItem.frontmatter &&
        !selectedItem.section &&
        (currentItemType !== "page" ||
          !pathname.includes(`/page/${selectedItem.pageNumber}/`)))
    ) {
      window.history.replaceState(null, "", path);
      //   router.push(path);
    }
  }, [selectedItem, router, pathname]);

  const handleSelectItem = (item: PoetryItem) => {
    setSelectedItem(item);
  };

  const handleAuthorChange = (author: string) => {
    setSelectedAuthors((prev) =>
      prev.includes(author)
        ? prev.filter((a) => a !== author)
        : [...prev, author]
    );
  };

  const handleClassroomChange = (classroom: string) => {
    setSelectedClassrooms((prev) =>
      prev.includes(classroom)
        ? prev.filter((c) => c !== classroom)
        : [...prev, classroom]
    );
  };

  // Get filtered items for navigation
  const getFilteredItems = () => {
    return poetryData.filter((item) => {
      const authorMatch =
        selectedAuthors.length === 0 || selectedAuthors.includes(item.author);
      const classroomMatch =
        selectedClassrooms.length === 0 ||
        selectedClassrooms.includes(item.classroom);
      return authorMatch && classroomMatch;
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <Header onMenuToggle={toggle} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          poetryItems={poetryData}
          selectedItem={selectedItem}
          onSelectItem={handleSelectItem}
          selectedAuthors={selectedAuthors}
          selectedClassrooms={selectedClassrooms}
          onAuthorChange={handleAuthorChange}
          onClassroomChange={handleClassroomChange}
          uniqueAuthors={uniqueAuthors}
          uniqueClassrooms={uniqueClassrooms}
          isMobileOpen={isOpen}
          onMobileClose={close}
        />
        <main className="flex-1 overflow-hidden">
          <ContentDisplay
            item={selectedItem}
            allItems={getFilteredItems()}
            onNavigate={handleSelectItem}
          />
        </main>
      </div>
    </div>
  );
};

export default MagazineLayout;

// "use client";

// import { type FC, useState, useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import Header from "./header";
// import Sidebar from "./sidebar";
// import ContentDisplay from "./content-display";
// import type { PoetryItem } from "@/types/magazine";
// import { getUniqueAuthors, getUniqueClassrooms } from "@/utils/filters";
// import { useMobileMenu } from "@/hooks/use-mobile-menu";
// import { getPoetryItemPath } from "@/utils/slugs";

// interface MagazineLayoutProps {
//   poetryData: PoetryItem[];
//   initialSelectedItem?: PoetryItem | null;
// }

// const MagazineLayout: FC<MagazineLayoutProps> = ({
//   poetryData,
//   initialSelectedItem = null,
// }) => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [selectedItem, setSelectedItem] = useState<PoetryItem | null>(
//     initialSelectedItem || (poetryData.length > 0 ? poetryData[0] : null)
//   );
//   const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
//   const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([]);
//   const { isOpen, toggle, close } = useMobileMenu();

//   const uniqueAuthors = getUniqueAuthors(poetryData);
//   const uniqueClassrooms = getUniqueClassrooms(poetryData);

//   // Update URL when selected item changes
//   useEffect(() => {
//     if (
//       selectedItem &&
//       !pathname.includes(`/page/${selectedItem.pageNumber}`)
//     ) {
//       const path = getPoetryItemPath(
//         selectedItem.pageNumber,
//         selectedItem.title
//       );
//       router.push(path);
//     }
//   }, [selectedItem, router, pathname]);

//   const handleSelectItem = (item: PoetryItem) => {
//     setSelectedItem(item);
//   };

//   const handleAuthorChange = (author: string) => {
//     setSelectedAuthors((prev) =>
//       prev.includes(author)
//         ? prev.filter((a) => a !== author)
//         : [...prev, author]
//     );
//   };

//   const handleClassroomChange = (classroom: string) => {
//     setSelectedClassrooms((prev) =>
//       prev.includes(classroom)
//         ? prev.filter((c) => c !== classroom)
//         : [...prev, classroom]
//     );
//   };

//   // Get filtered items for navigation
//   const getFilteredItems = () => {
//     return poetryData.filter((item) => {
//       const authorMatch =
//         selectedAuthors.length === 0 || selectedAuthors.includes(item.author);
//       const classroomMatch =
//         selectedClassrooms.length === 0 ||
//         selectedClassrooms.includes(item.classroom);
//       return authorMatch && classroomMatch;
//     });
//   };

//   return (
//     <div className="flex flex-col h-screen">
//       <Header onMenuToggle={toggle} />
//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar
//           poetryItems={poetryData}
//           selectedItem={selectedItem}
//           onSelectItem={handleSelectItem}
//           selectedAuthors={selectedAuthors}
//           selectedClassrooms={selectedClassrooms}
//           onAuthorChange={handleAuthorChange}
//           onClassroomChange={handleClassroomChange}
//           uniqueAuthors={uniqueAuthors}
//           uniqueClassrooms={uniqueClassrooms}
//           isMobileOpen={isOpen}
//           onMobileClose={close}
//         />
//         <main className="flex-1 overflow-hidden">
//           <ContentDisplay
//             item={selectedItem}
//             allItems={getFilteredItems()}
//             onNavigate={handleSelectItem}
//           />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default MagazineLayout;

// // "use client";

// // import { type FC, useState } from "react";
// // import Header from "./header";
// // import Sidebar from "./sidebar";
// // import ContentDisplay from "./content-display";
// // import type { PoetryItem } from "@/types/magazine";
// // import { getUniqueAuthors, getUniqueClassrooms } from "@/utils/filters";
// // import { useMobileMenu } from "@/hooks/use-mobile-menu";

// // interface MagazineLayoutProps {
// //   poetryData: PoetryItem[];
// // }

// // const MagazineLayout: FC<MagazineLayoutProps> = ({ poetryData }) => {
// //   const [selectedItem, setSelectedItem] = useState<PoetryItem | null>(
// //     poetryData.length > 0 ? poetryData[0] : null
// //   );
// //   const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
// //   const [selectedClassrooms, setSelectedClassrooms] = useState<string[]>([]);
// //   const { isOpen, toggle, close } = useMobileMenu();

// //   const uniqueAuthors = getUniqueAuthors(poetryData);
// //   const uniqueClassrooms = getUniqueClassrooms(poetryData);

// //   const handleAuthorChange = (author: string) => {
// //     setSelectedAuthors((prev) =>
// //       prev.includes(author)
// //         ? prev.filter((a) => a !== author)
// //         : [...prev, author]
// //     );
// //   };

// //   const handleClassroomChange = (classroom: string) => {
// //     setSelectedClassrooms((prev) =>
// //       prev.includes(classroom)
// //         ? prev.filter((c) => c !== classroom)
// //         : [...prev, classroom]
// //     );
// //   };

// //   // Get filtered items for navigation
// //   const getFilteredItems = () => {
// //     return poetryData.filter((item) => {
// //       const authorMatch =
// //         selectedAuthors.length === 0 || selectedAuthors.includes(item.author);
// //       const classroomMatch =
// //         selectedClassrooms.length === 0 ||
// //         selectedClassrooms.includes(item.classroom);
// //       return authorMatch && classroomMatch;
// //     });
// //   };

// //   return (
// //     <div className="flex flex-col h-screen">
// //       <Header onMenuToggle={toggle} />
// //       <div className="flex flex-1 overflow-hidden">
// //         <Sidebar
// //           poetryItems={poetryData}
// //           selectedItem={selectedItem}
// //           onSelectItem={setSelectedItem}
// //           selectedAuthors={selectedAuthors}
// //           selectedClassrooms={selectedClassrooms}
// //           onAuthorChange={handleAuthorChange}
// //           onClassroomChange={handleClassroomChange}
// //           uniqueAuthors={uniqueAuthors}
// //           uniqueClassrooms={uniqueClassrooms}
// //           isMobileOpen={isOpen}
// //           onMobileClose={close}
// //         />
// //         <main className="flex-1 overflow-hidden">
// //           <ContentDisplay
// //             item={selectedItem}
// //             allItems={getFilteredItems()}
// //             onNavigate={setSelectedItem}
// //           />
// //         </main>
// //       </div>
// //     </div>
// //   );
// // };

// // export default MagazineLayout;
