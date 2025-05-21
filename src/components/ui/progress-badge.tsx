
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressBadgeProps {
  value: number;
  className?: string;
  textColor?: string;
}

export function ProgressBadge({ value, className, textColor }: ProgressBadgeProps) {
  const progressColor = value < 30 ? "bg-red-500" : value < 70 ? "bg-amber-500" : "bg-green-500";
  
  return (
    <div className={cn("flex flex-col space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <p className={cn("text-sm font-medium", textColor)}>
          {Math.round(value)}%
        </p>
      </div>
      <Progress
        value={value}
        className="h-2"
        indicatorClassName={progressColor}
      />
    </div>
  );
}
