import { TabsContent } from "@/components/ui/tabs";
import React, { useEffect } from "react";

interface TabDisciplinasProps {
  value: string;
}

export const TabDisciplinas = ({ value }: TabDisciplinasProps) => {
	useEffect(() => {
		console.log('Fetch Disciplinas')
	}, [])
  return <TabsContent value={value}>Disciplinas</TabsContent>;
};
