import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { Grade } from "./types";

interface FiltroProps {
  grades: Grade[];
  gradeAtiva: string | undefined;
  setGradeAtiva: Dispatch<SetStateAction<string | undefined>>;
  isFetching: boolean;
}

export const FiltroGrades = ({
  grades,
  gradeAtiva,
  setGradeAtiva,
  isFetching,
}: FiltroProps) => {
  const [tempGrade, setTempGrade] = useState(gradeAtiva);

  const handleSelect = (e: string) => {
    setTempGrade(e);
  };

  const onClickOut = () => {
    setTempGrade(gradeAtiva);
  };

  const handleSubmit = () => {
    setGradeAtiva(tempGrade);
  };

  return (
    <DropdownMenu onOpenChange={onClickOut}>
      <DropdownMenuTrigger className="my-4" asChild>
        <Button disabled={isFetching}>
          <Filter /> Filtro
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="space-y-2">
          <h2 className="p-1 text-sm font-bold">Grade Curricular</h2>
          <Select onValueChange={(e) => handleSelect(e)} value={tempGrade && tempGrade}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {grades?.map((grade) => (
                <SelectItem key={grade.id_grade} value={grade.id_grade}>
                  {grade.semestre_letivo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isFetching}
          >
            {isFetching && <Loader2 className="animate-spin" />}
            Buscar
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
