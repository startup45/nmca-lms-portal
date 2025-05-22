
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressBadgeProps {
  value: number;
  className?: string;
  textColor?: string;
}

export function ProgressBadge({ value, className, textColor }: ProgressBadgeProps) {
  // Make sure value is within 0-100 range
  const safeValue = Math.max(0, Math.min(100, value));
  
  // Determine progress color based on the value
  const progressColor = 
    safeValue < 30 ? "bg-red-500" : 
    safeValue < 70 ? "bg-amber-500" : 
    "bg-green-500";
  
  return (
    <div className={cn("flex flex-col space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <p className={cn("text-sm font-medium", textColor)}>
          {Math.round(safeValue)}%
        </p>
      </div>
      <Progress
        value={safeValue}
        className="h-2"
        indicatorClassName={progressColor}
      />
    </div>
  );
}
