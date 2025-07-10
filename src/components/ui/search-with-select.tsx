import * as React from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface SearchWithSelectProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectValue: string;
  onSelectChange: (value: string) => void;
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  selectItems: { value: string; label: string }[];
  className?: string;
}

const SearchWithSelect: React.FC<SearchWithSelectProps> = ({
  searchValue,
  onSearchChange,
  selectValue,
  onSelectChange,
  selectPlaceholder = "Filter",
  searchPlaceholder = "Search",
  selectItems,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Search Input on the Left */}
      <Input
        startIcon={Search}
        type="search"
        placeholder={searchPlaceholder}
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="sm:w-[200px]"
      />

      {/* Select on the Right */}
      <Select value={selectValue} onValueChange={onSelectChange}>
        <SelectTrigger className="w-[120px] h-9">
          <SelectValue placeholder={selectPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {selectItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export { SearchWithSelect };
