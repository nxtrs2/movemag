"use client";

import type { FC } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import AuthorFilter from "./filters/author-filter";
import ClassroomFilter from "./filters/classroom-filter";
import type { PoetryItem } from "@/types/magazine";
import { X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  poetryItems: PoetryItem[];
  selectedItem: PoetryItem | null;
  onSelectItem: (item: PoetryItem) => void;
  selectedAuthors: string[];
  selectedClassrooms: string[];
  onAuthorChange: (author: string) => void;
  onClassroomChange: (classroom: string) => void;
  uniqueAuthors: string[];
  uniqueClassrooms: string[];
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({
  poetryItems,
  selectedItem,
  onSelectItem,
  selectedAuthors,
  selectedClassrooms,
  onAuthorChange,
  onClassroomChange,
  uniqueAuthors,
  uniqueClassrooms,
  isMobileOpen,
  onMobileClose,
}) => {
  // Filter items based on selected filters
  const filteredItems = poetryItems.filter((item) => {
    // Skip filtering for frontmatter items
    if (item.frontmatter) return true;

    // Apply filters to both section items and regular pages
    const authorMatch =
      selectedAuthors.length === 0 || selectedAuthors.includes(item.author);
    const classroomMatch =
      selectedClassrooms.length === 0 ||
      selectedClassrooms.includes(item.classroom);
    return authorMatch && classroomMatch;
  });

  // Separate frontmatter items
  const frontmatterItems = filteredItems.filter((item) => item.frontmatter);
  // Combine section items and regular pages
  const contentItems = filteredItems.filter((item) => !item.frontmatter);

  const sidebarContent = (
    <>
      <div className="sticky top-0 z-10 bg-gray-50 p-4 border-b">
        <div className="flex items-center justify-between md:hidden">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="md:hidden">
          <Separator className="my-2" />
        </div>
        <h2 className="text-lg font-semibold hidden md:block">Filters</h2>
        <AuthorFilter
          authors={uniqueAuthors}
          selectedAuthors={selectedAuthors}
          onAuthorChange={onAuthorChange}
        />
        <Separator className="my-4" />
        <ClassroomFilter
          classrooms={uniqueClassrooms}
          selectedClassrooms={selectedClassrooms}
          onClassroomChange={onClassroomChange}
        />
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[350px] md:h-[400px] bg-white shadow-inner">
          <div className="p-4">
            {/* Frontmatter Items */}
            {frontmatterItems.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Frontmatter
                </h2>
                <div className="space-y-2">
                  {frontmatterItems.map((item) => (
                    <button
                      key={`frontmatter-${item.title}`}
                      onClick={() => {
                        onSelectItem(item);
                        onMobileClose();
                      }}
                      className={`w-full text-left p-2 rounded-md hover:bg-accent transition-colors ${
                        selectedItem?.title === item.title &&
                        selectedItem?.frontmatter
                          ? "bg-accent"
                          : ""
                      }`}
                    >
                      <div className="font-medium">{item.title}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Content Items (Sections + Regular Pages) */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Pages</h2>
              <div className="space-y-2">
                {contentItems.map((item, index) => (
                  <button
                    key={`content-${item.section ? item.title : index}`}
                    onClick={() => {
                      onSelectItem(item);
                      onMobileClose();
                    }}
                    className={`w-full text-left p-2 rounded-md hover:bg-accent transition-colors ${
                      (selectedItem?.section &&
                        selectedItem?.title === item.title) ||
                      (!selectedItem?.section &&
                        !selectedItem?.frontmatter &&
                        selectedItem?.id === item.id)
                        ? "bg-accent"
                        : ""
                    }`}
                  >
                    <div className="font-medium">{item.title}</div>
                    {!item.section && (
                      <div className="text-sm text-muted-foreground">
                        Page {item.pageNumber} • {item.author}
                      </div>
                    )}
                  </button>
                ))}
                {contentItems.length === 0 && (
                  <div className="text-sm text-muted-foreground py-4 text-center">
                    No items match the selected filters
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex w-64 border-r bg-gray-100 h-[calc(100vh-4rem)] flex-col">
        {sidebarContent}
      </div>

      {/* Mobile sidebar (sheet) */}
      <Sheet open={isMobileOpen} onOpenChange={onMobileClose}>
        <SheetContent
          side="left"
          className="p-0 w-[80%] sm:w-[350px] flex flex-col h-full"
        >
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;
