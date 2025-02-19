"use client";

import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale/pt-BR";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("pt-BR", ptBR);

const Calendar = ({ selected, onSelect }) => {
  const [startDate, setStartDate] = useState(selected || new Date());

  const handleChange = (date) => {
    setStartDate(date);
    onSelect(date);
  };

  return (
    <div className="rounded w-[230px] h-[223px] text-xs m-0 p-0 h-full">
      <DatePicker
        selected={startDate}
        onChange={handleChange}
        locale="pt-BR"
        dateFormat="dd/MM/yyyy"
        className="w-full h-full border-none shadow-none bg-white"
        showPopperArrow={false}
        popperClassName="calendar-popup-left"
        inline
        
      />
    </div>
  );
};

export default Calendar;