import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { cn } from "@/lib/utils"

interface Opcao {
  valor: string
  rotulo: string
}

interface CampoSelecaoProps {
  options: Opcao[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  className?: string
}

export function CampoSelecao({
  options,
  value,
  onChange,
  placeholder = "Selecione uma opção",
  error,
  className,
}: CampoSelecaoProps) {
  return (
    <div className={cn("relative space-y-2", className)}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={cn(error && "border-red-500 focus:ring-red-500")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="absolute z-50 bg-white shadow-lg border rounded-md">
          {options.map((option) => (
            <SelectItem
              key={option.valor}
              value={option.valor}
              className="cursor-pointer hover:bg-gray-100 transition-colors"
            >
              {option.rotulo}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
