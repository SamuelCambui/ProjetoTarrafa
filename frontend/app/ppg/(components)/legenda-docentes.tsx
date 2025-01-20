import React from 'react';
import { CircleAlert } from 'lucide-react';

const LegendaTabelaDocentes = () => {
  return (
    <div className="flex gap-6 mb-4">
      <div className="flex items-center gap-2">
        <CircleAlert className="w-5 h-5 text-red-400" />
        <span>+12 meses</span>
      </div>
      <div className="flex items-center gap-2">
        <CircleAlert className="w-5 h-5 text-orange-400" />
        <span>entre 8 e 12 meses</span>
      </div>
      <div className="flex items-center gap-2">
        <CircleAlert className="w-5 h-5 text-amber-400" />
        <span>entre 6 e 8 meses</span>
      </div>
      <div className="flex items-center gap-2">
        <CircleAlert className="w-5 h-5 text-teal-500" />
        <span>entre 3 e 6 meses</span>
      </div>
      <div className="flex items-center gap-2">
        <CircleAlert className="w-5 h-5 text-green-500" />
        <span>menos de 2 meses</span>
      </div>
    </div>
  );
};

export default LegendaTabelaDocentes;
