import { Card, CardContent, CardHeader } from "./card";

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl border border-border p-6 animate-pulse">
        <div className="h-5 bg-primary/10 rounded w-48 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-primary/10 rounded w-3/4" />
                <div className="h-2 bg-primary/10 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CardSkeleton = ({ rows = 4 }: { rows?: number }) => {
  return Array.from({ length: rows }).map((_, i) => (
    <Card
      key={i}
      className="flex bg-default border-border items-center gap-4 p-6 animate-pulse"
    >
      <CardHeader className="p-0">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
          <div className="text-blue-dark"></div>
        </div>
      </CardHeader>
      <CardContent className="p-0 w-full">
        <div className="h-2.5 bg-primary/10 rounded-full w-full mb-2.5 mx-auto"></div>
        <div className="h-2.5 bg-primary/10 rounded-full w-full mb-2.5 mx-auto"></div>
      </CardContent>
    </Card>
  ));
};
