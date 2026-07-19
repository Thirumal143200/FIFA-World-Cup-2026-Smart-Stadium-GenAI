import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-foreground">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest animate-pulse">
          Loading FIFA StadiumOS...
        </p>
      </div>
    </div>
  );
}
