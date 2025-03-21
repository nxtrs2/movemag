"use client";

import { type FC, useEffect, useState } from "react";
import Image from "next/image";
import type { PoetryItem } from "@/types/magazine";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Share2, Check } from "lucide-react";
import { getPoetryItemPath } from "@/utils/slugs";

interface FullScreenViewerProps {
  items: PoetryItem[];
  currentItem: PoetryItem;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (item: PoetryItem) => void;
}

const FullScreenViewer: FC<FullScreenViewerProps> = ({
  items,
  currentItem,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Find the current index based on the unique identifier for each item type
  const currentIndex = items.findIndex((i) => {
    if (currentItem.frontmatter && i.frontmatter) {
      return currentItem.title === i.title;
    } else if (currentItem.section && i.section) {
      return currentItem.title === i.title;
    } else {
      return currentItem.id === i.id;
    }
  });

  // Determine if we can navigate
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  // Navigation handlers
  const handlePrevious = () => {
    if (hasPrevious) {
      onNavigate(items[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onNavigate(items[currentIndex + 1]);
    }
  };

  // Share handler
  const handleShare = async () => {
    const path = getPoetryItemPath(currentItem);
    const url = `${window.location.origin}${path}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${currentItem.title}${
            currentItem.author ? ` by ${currentItem.author}` : ""
          }`,
          text: `Check out this ${
            currentItem.frontmatter
              ? "frontmatter"
              : currentItem.section
              ? "section"
              : "poem"
          } from Move magazine: ${currentItem.title}${
            currentItem.author ? ` by ${currentItem.author}` : ""
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

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, items]);

  // Animation effect
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      {/* Top bar with title and close button */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-black/50 text-white z-10">
        <div className="text-lg font-medium truncate max-w-[80%]">
          {currentItem.title}
          {!currentItem.frontmatter &&
            !currentItem.section &&
            ` (Page ${currentItem.pageNumber})`}
        </div>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="text-white hover:bg-white/20 mr-2"
            aria-label="Share this page"
          >
            {shareSuccess ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <Share2 className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-white hover:bg-white/20"
            aria-label="Close full screen view"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Main image container */}
      <div
        className="relative w-full h-full flex items-center justify-center p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full max-w-4xl max-h-[80vh]">
          <Image
            src={currentItem.url || "/placeholder.svg"}
            alt={`Full page scan of ${currentItem.title}`}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 80vw"
          />
        </div>

        {/* Navigation buttons */}
        {hasPrevious && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
        )}

        {hasNext && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
            aria-label="Next page"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        )}
      </div>

      {/* Bottom info bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4 text-center">
        <div className="text-sm">
          {currentIndex + 1} of {items.length}
          {currentItem.author && ` • ${currentItem.author}`}
          {currentItem.classroom && ` • ${currentItem.classroom}`}
        </div>
      </div>
    </div>
  );
};

export default FullScreenViewer;
