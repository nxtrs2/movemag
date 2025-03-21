import type { FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AuthorFilterProps {
  authors: string[];
  selectedAuthors: string[];
  onAuthorChange: (author: string) => void;
}

const AuthorFilter: FC<AuthorFilterProps> = ({
  authors,
  selectedAuthors,
  onAuthorChange,
}) => {
  // Filter out empty strings
  const validAuthors = authors.filter((author) => author.trim() !== "");

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm">Authors</h3>
      <div className="grid grid-cols-2 gap-1">
        {validAuthors.map((author) => (
          <div key={author} className="flex items-center space-x-2">
            <Checkbox
              id={`author-${author}`}
              checked={selectedAuthors.includes(author)}
              onCheckedChange={() => onAuthorChange(author)}
            />
            <Label
              htmlFor={`author-${author}`}
              className="text-sm font-normal cursor-pointer truncate"
            >
              {author}
            </Label>
          </div>
        ))}
        {validAuthors.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No authors available
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorFilter;
