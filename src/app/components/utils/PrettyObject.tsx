import { Card } from "@/components/ui/card";

export function PrettyObject({ children }: { children: unknown }) {
  return (
    <Card className="flex flex-col gap-2 whitespace-pre-wrap border border-success p-2">
      <p className="border-b text-center">Object</p>
      {JSON.stringify(children, null, "\t")}
    </Card>
  );
}
