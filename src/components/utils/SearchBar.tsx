import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  setSearch: (value: string) => void;
  className?: string;
};

export function SearchBar({ setSearch, className }: SearchBarProps) {
  return (
    <div className={cn("w-full", className)}>
      <Input
        placeholder="Search"
        className="bg-bgnav mb-3 text-secondary-foreground h-8"
        endAdornment={<Search className="text-muted-foreground" size={20} />}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
