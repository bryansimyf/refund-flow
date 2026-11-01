import type { ReactNode } from "react";

type FullHeightLayoutProps = {
  children: ReactNode;
};

export function FullHeightLayout({ children }: FullHeightLayoutProps) {
  return <div className="flex min-h-dvh flex-col">{children}</div>;
}
