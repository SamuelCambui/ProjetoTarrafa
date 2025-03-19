import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DadosColab } from "@/lib/ppg/definitions";

interface Professor {
  id_sucupira: string;
  nome: string;
}

export const RedeColabPpg = ({
  dadosColab,
  listaProfessores,
}: {
  dadosColab: DadosColab;
  listaProfessores: Professor[];
}) => {
  const [docenteSelecionado, setDocenteSelecionado] = useState<string>("");
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!dadosColab || !svgRef.current) return;

    const { nodes, links } = dadosColab;
    if (!nodes.length || !links.length) return;

    const width = 1100;
    const height = 800;

    d3.select(svgRef.current).selectAll("*").remove(); // Clear previous graph

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    // Define simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links)
          .id((d: any) => d.id)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(0, 0));

    // Links
    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5);

    // Nodes
    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d: any) => (d.group === "authors" || d.group === "authors_solo" ? 8 : 5))
      .attr("fill", (d: any) => {
        if (d.group === "authors") {
          return d.id.toUpperCase() === docenteSelecionado.toUpperCase() ? d3.schemeCategory10[1] : d3.schemeCategory10[0];
        }
        if (d.group === "authors_solo") return d3.schemeCategory10[7];
        return d3.schemeCategory10[4];
      })
      .call(
        d3
          .drag()
          .on("start", (event: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
          })
          .on("drag", (event: any) => {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
          })
          .on("end", (event: any) => {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
          }),
      );

    node.append("title").text((d: any) => d.id);

    // Labels
    const text = svg
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("style", "font: 8px sans-serif;")
      .text((d: any) => (d.group === "authors" || d.group === "authors_solo" ? d.id.trim().split(" ")[0] : ""));

    // Simulation updates
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
      text.attr("x", (d: any) => d.x + 10).attr("y", (d: any) => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, [dadosColab, docenteSelecionado]);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Rede de Colaboração</CardTitle>
        <CardDescription>
          Apresenta os relacionamentos entre coautores e artigos em comum. Este grafo evidencia comunidades de parcerias
          dentro do PPG.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select value={docenteSelecionado} onValueChange={setDocenteSelecionado}>
          <SelectTrigger className="w-96">
            <SelectValue placeholder="Selecione um professor" />
          </SelectTrigger>
          <SelectContent>
            {listaProfessores.map((professor) => (
              <SelectItem key={professor.id_sucupira} value={professor.nome}>
                {professor.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="mt-4">
          <svg ref={svgRef} />
        </div>
      </CardContent>
    </Card>
  );
};
