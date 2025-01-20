import React from "react";
import { CircleAlert } from "lucide-react";
import { obterCor } from "@/lib/utils";

type Status = {
  quantidade: number;
  legenda: string;
};

type StatusAtualizacaoProps = {
  tempoAtualizacao: Status[];
};

export default function StatusAtualizacao ({ tempoAtualizacao }: StatusAtualizacaoProps) {

  return (
    <div className="flex justify-between mt-2 ">
      {tempoAtualizacao.map((status, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <div className={`w-5 h-5 text-red-400`} />
          <CircleAlert className={`w-5 h-5 ${obterCor(status.legenda)}`} />
          <span className="">{status.legenda}</span>
        </div>
      ))}
    </div>
  );
};

