import { Frown } from "lucide-react";

export const SemDados = () => {
  return (
    <div className="flex justify-center text-lg items-center gap-2 text-muted-foreground h-48">
      <Frown className="mr-2 size-6" /> <span>Sem dados.</span>
    </div>
  );
};
