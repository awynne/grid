import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BALANCING_AUTHORITIES } from "@/lib/constants";

interface BASelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function BASelector({ value, onValueChange, className }: BASelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`w-[250px] [&>span:first-child]:text-left [&>span:first-child]:truncate ${className || ''}`}>
        <SelectValue placeholder="Select Balancing Authority" />
      </SelectTrigger>
      <SelectContent className="w-[280px]">
        {BALANCING_AUTHORITIES.map((ba) => (
          <SelectItem key={ba.code} value={ba.code} title={ba.name}>
            <span className="truncate">{ba.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}