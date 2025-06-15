
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StepIndicatorProps {
  steps: { title: string; description?: string; tooltip?: string }[];
  currentStep: number;
  onStepClick?: (stepIdx: number) => void;
}

export const StepIndicator = ({ steps, currentStep, onStepClick }: StepIndicatorProps) => (
  <ol className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-12 mb-8">
    {steps.map((s, i) => (
      <li
        key={i}
        className={`flex items-center group cursor-pointer`}
        aria-current={i === currentStep ? "step" : undefined}
        tabIndex={0}
        onClick={() => onStepClick?.(i)}
        onKeyDown={e => e.key === "Enter" && onStepClick?.(i)}
        aria-label={`${i + 1}. ${s.title}${i === currentStep ? " (current step)" : ""}`}
        role="listitem"
      >
        <div
          className={`
            flex items-center justify-center w-10 h-10 rounded-full
            text-white font-bold border-4 border-blue-400 transition
            ${i < currentStep ? "bg-blue-500" : i === currentStep ? "bg-blue-600 animate-pulse" : "bg-gray-300 border-gray-200"}
          `}
        >
          {i + 1}
        </div>
        <div className="ml-3 flex flex-col">
          <div className="flex items-center gap-1 text-base font-semibold text-gray-900">
            {s.title}
            {s.tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="ml-1 cursor-pointer" tabIndex={0}>
                      <Info className="w-4 h-4 text-blue-400 hover:text-blue-600" aria-label="More info" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top">{s.tooltip}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {s.description && <span className="ml-0.5 text-xs text-gray-500">{s.description}</span>}
        </div>
        {i < steps.length - 1 && (
          <div className="hidden sm:block ml-4 w-8 border-t-4 border-gray-200" aria-hidden="true"></div>
        )}
      </li>
    ))}
  </ol>
);
