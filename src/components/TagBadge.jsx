import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function TagBadge({ name, color, selected, onClick }) {
  return (
    <Badge
      onClick={onClick}
      style={{
        backgroundColor: selected ? color : "transparent",
        borderColor: color,
      }}
      className={cn(
        "cursor-pointer border hover:bg-opacity-90 transition-all",
        selected ? "text-white" : "text-foreground",
      )}
      variant="outline"
    >
      {name}
    </Badge>
  );
}
