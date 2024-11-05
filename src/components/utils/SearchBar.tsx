import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  className?: string;
};

export function SearchBar({ search, setSearch, className }: SearchBarProps) {
  return (
    <div className={cn("w-full", className)}>
      <Input
        placeholder="Search"
        className="bg-bgnav mb-3 text-secondary-foreground h-8"
        endAdornment={<Search className="text-muted-foreground" size={20} />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
