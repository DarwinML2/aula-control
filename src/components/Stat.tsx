import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
interface StatProps {
  title: string;
  value: number | string | null;
  background: string;
}
export function Stat({ title, value, background }: StatProps) {
  if (value === null) return null;
  return (
    <div>
      <Card className={cn(background, "h-full text-white")}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">{value}</p>
        </CardContent>
      </Card>
    </div>
  );
}
