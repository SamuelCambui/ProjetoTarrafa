import { ProgressBar } from "@/components/progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type CardSetupProps = {
  titulo: string;
  progresso: number;
  onStart: () => void;
};

export default function CardSetup({
  titulo,
  progresso,
  onStart,
}: CardSetupProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{titulo}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-sm font-medium mb-1">TOTAL</div>
            <div className="text-2xl">0</div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">
              PROCESSADOS COM SUCESSO
            </div>
            <div className="text-2xl">0</div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">NÃO PROCESSADOS</div>
            <div className="text-2xl">0</div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">ERROS</div>
            <div className="text-2xl">0</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button size="lg" onClick={onStart}>
            Iniciar tarefa
          </Button>
          <div className="flex-grow">
            <ProgressBar value={progresso} label="Progresso da tarefa" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
