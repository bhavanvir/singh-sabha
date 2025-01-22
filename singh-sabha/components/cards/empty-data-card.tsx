import { Card, CardContent, CardTitle } from "@/components/ui/card";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyDataCardProps {
  icon: LucideIcon;
  title: string;
  description: string | ReactNode;
  className?: string;
}

export default function EmptyDataCard({
  icon: Icon,
  title,
  description,
  className = "",
}: EmptyDataCardProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Card className="max-w-md">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Icon className="w-12 h-12 text-muted-foreground" />
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {title}
            </CardTitle>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
