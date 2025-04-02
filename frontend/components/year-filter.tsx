"use client";

import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";

export default function YearFilter() {
  const [startYear, setStartYear] = useState<string | undefined>(undefined);
  const [endYear, setEndYear] = useState<string | undefined>(undefined);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 101 }, (_, i) => `${currentYear - i}`);

  const isEndYearValid = !startYear || !endYear || parseInt(endYear) >= parseInt(startYear);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">

        <div>
          <label htmlFor="start-year" className="block text-sm font-medium text-gray-700">
            Ano de Início
          </label>
          <Select onValueChange={setStartYear} defaultValue="2017">
            <SelectTrigger id="start-year">
              <SelectValue placeholder="Selecione o ano de início" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="end-year" className="block text-sm font-medium text-gray-700">
            Ano de Fim
          </label>
          <Select onValueChange={setEndYear} defaultValue="2024">
            <SelectTrigger id="end-year">
              <SelectValue placeholder="Selecione o ano de fim" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {years.map((year) => (
                  <SelectItem key={year} value={year} disabled={startYear ? parseInt(year) < parseInt(startYear) : false}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!isEndYearValid && (
        <p className="text-sm text-red-500">O ano de fim deve ser maior ou igual ao ano de início.</p>
      )}
    </div>
  );
}
