"use client";

import { type FC, useState } from "react";
import Image from "next/image";
import type { PoetryItem } from "@/types/magazine";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ReactMarkdown from "react-markdown";
import FullScreenViewer from "./full-screen-viewer";
import { getPoetryItemPath } from "@/utils/slugs";

interface ContentDisplayProps {
  item: PoetryItem | null;
  allItems: PoetryItem[];
  onNavigate: (item: PoetryItem) => void;
}

const ContentDisplay: FC<ContentDisplayProps> = ({
  item,
  allItems,
  onNavigate,
}) => {
  const [isFullScreenOpen, setIsFullScreenOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!item) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Select a poem to view</p>
      </div>
    );
  }

  // Find the current index based on the unique identifier for each item type
  const currentIndex = allItems.findIndex((i) => {
    if (item.frontmatter && i.frontmatter) {
      return item.title === i.title;
    } else if (item.section && i.section) {
      return item.title === i.title;
    } else {
      return item.id === i.id;
    }
  });

  // Determine if we can navigate
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allItems.length - 1;

  // Navigation handlers
  const handlePrevious = () => {
    if (hasPrevious) {
      onNavigate(allItems[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onNavigate(allItems[currentIndex + 1]);
    }
  };

  // Share handler
  const handleShare = async () => {
    if (!item) return;

    const path = getPoetryItemPath(item);
    const url = `${window.location.origin}${path}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${item.title}${item.author ? ` by ${item.author}` : ""}`,
          text: `Check out this ${
            item.frontmatter ? "frontmatter" : item.section ? "section" : "poem"
          } from Move magazine: ${item.title}${
            item.author ? ` by ${item.author}` : ""
          }`,
          url: url,
        });
        setShareSuccess(true);
      } else {
        await navigator.clipboard.writeText(url);
        setShareSuccess(true);
      }

      // Reset success state after 2 seconds
      setTimeout(() => {
        setShareSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="h-full overflow-auto p-2 sm:p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="p-3 sm:p-4 md:p-6">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl sm:text-2xl">
                {item.title}
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleShare}
                      className="ml-2"
                    >
                      {shareSuccess ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Share2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {shareSuccess
                        ? "Copied to clipboard!"
                        : "Share this page"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-muted-foreground">
              {item.author && (
                <span>
                  By {item.author}
                  {item.classroom && <span> - {item.classroom}</span>}
                </span>
              )}
              {!item.frontmatter && !item.section && (
                <span>Page {item.pageNumber}</span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
            <div className="relative aspect-[3/4] w-full mb-4 border rounded-md overflow-hidden group">
              <Image
                src={item.url || "/placeholder.svg"}
                alt={`Scanned page of ${item.title}`}
                fill
                className="object-contain cursor-pointer"
                priority
                onClick={() => setIsFullScreenOpen(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsFullScreenOpen(true)}
                aria-label="View full screen"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>

              {/* Navigation buttons overlaid on the image */}
              {hasPrevious && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handlePrevious}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}

              {hasNext && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleNext}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
            {(item.content || item.classroom) && (
              <>
                <Separator className="my-4" />
                <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
                  {/* {item.classroom && (
                    <h3 className="text-base sm:text-lg">
                      Classroom: {item.classroom}
                    </h3>
                  )}
                  {item.content && (
                    <ReactMarkdown>{item.content}</ReactMarkdown>
                  )} */}
                </div>
              </>
            )}
          </CardContent>

          {/* Navigation footer */}
          <CardFooter className="p-3 sm:p-4 md:p-6 pt-0 flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={!hasPrevious}
              className="w-[120px] justify-start"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="text-sm text-muted-foreground">
              {currentIndex + 1} of {allItems.length}
            </div>

            <Button
              variant="outline"
              onClick={handleNext}
              disabled={!hasNext}
              className="w-[120px] justify-end"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Full Screen Viewer */}
      <FullScreenViewer
        items={allItems}
        currentItem={item}
        isOpen={isFullScreenOpen}
        onClose={() => setIsFullScreenOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
};

export default ContentDisplay;
