import { cn } from "@/lib/shadcn/utils";

type StatusChipTone = "success" | "warning";

type StatusChipProps = {
  label: string;
  tone: StatusChipTone;
};

function statusChipToneClass(tone: StatusChipTone) {
  if (tone === "warning") {
    return "bg-warning-50 text-warning-700 ring-warning-200";
  }

  return "bg-success-50 text-success-700 ring-success-200";
}

export function StatusChip({ label, tone }: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-label ring-1 ring-inset",
        statusChipToneClass(tone),
      )}
    >
      {label}
    </span>
  );
}
