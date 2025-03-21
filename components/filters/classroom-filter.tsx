import type { FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ClassroomFilterProps {
  classrooms: string[];
  selectedClassrooms: string[];
  onClassroomChange: (classroom: string) => void;
}

const ClassroomFilter: FC<ClassroomFilterProps> = ({
  classrooms,
  selectedClassrooms,
  onClassroomChange,
}) => {
  // Filter out empty strings
  const validClassrooms = classrooms.filter(
    (classroom) => classroom.trim() !== ""
  );

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm">Class</h3>
      <div className="grid grid-cols-3 gap-1">
        {validClassrooms.map((classroom) => (
          <div key={classroom} className="flex items-center space-x-2">
            <Checkbox
              id={`classroom-${classroom}`}
              checked={selectedClassrooms.includes(classroom)}
              onCheckedChange={() => onClassroomChange(classroom)}
            />
            <Label
              htmlFor={`classroom-${classroom}`}
              className="text-sm font-normal cursor-pointer truncate"
            >
              {classroom}
            </Label>
          </div>
        ))}
        {validClassrooms.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No classrooms available
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomFilter;
