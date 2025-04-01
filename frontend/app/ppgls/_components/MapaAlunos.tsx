import * as d3 from "d3";
import * as topojson from "topojson-client";
import "@/public/br.json";
import { RefObject, useEffect, useRef } from "react";

type DadosMapa = {
  longitude: number;
  latitude: number;
  quantidade_alunos: number;
  naturalidade: string;
  estado: string;
};

const carregaGraficoMapaBrasil = (
  dados: DadosMapa[],
  ref: RefObject<SVGSVGElement>,
): void => {
  const container = d3.select("#mapa-brasil-container");
  const width =
    (container.node() as HTMLElement)?.getBoundingClientRect().width || 0;
  const height = 700;

  // Selecionar o elemento SVG
  const svg = d3
    .select(ref.current)
    .attr("width", width)
    .attr("height", height);

  // Configurar uma projeção para o mapa
  const projection = d3
    .geoMercator()
    .center([-55, -10])
    .scale(900)
    .translate([width / 2, height / 2 - 50]);

  const path = d3.geoPath().projection(projection);

  d3.json("/br.json")
    .then((data: any) => {
      const brazil = topojson.feature(data, data.objects.estados) as any;

      // Renderizar o mapa do Brasil
      svg
        .selectAll<SVGPathElement, GeoJSON.Feature>("path")
        .data(brazil.features)
        .enter()
        .append("path")
        .attr("d", path as any)
        .attr("fill", "#abc8e8")
        .attr("stroke", "white");

      const zoom = d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);

      svg.call(zoom as any);

      const resetZoom = () => {
        svg
          .transition()
          .duration(650)
          .call(zoom.transform as any, d3.zoomIdentity);
      };

      d3.select("#reset-zoom").on("click", resetZoom);

      const radiusScale = d3
        .scaleSqrt()
        .domain([0, d3.max(dados, (d) => d.quantidade_alunos) || 0])
        .range([3, 30]);

      const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("font-size", "12px")
        .style("color", "rgba(255, 255, 255, 0.8)")
        .style("background-color", "rgba(34, 34, 34, 0.8)")
        .style("padding", "10px")
        .style("border-radius", "5px")
        .style("pointer-events", "none")
        .style("opacity", 0);
      
      const maxRadius = 50;
      svg
        .selectAll<SVGCircleElement, DadosMapa>("circle")
        .data(dados.filter(d => d.quantidade_alunos !== undefined)) // Filtra valores inválidos
        .data(dados)
        .enter()
        .append("circle")
        .attr("cx", (d) => projection([d.longitude, d.latitude])![0])
        .attr("cy", (d) => projection([d.longitude, d.latitude])![1])
        .attr("r", (d) => radiusScale(d.quantidade_alunos))
        .attr("fill", "blue")
        .attr("stroke", "white")
        .attr("fill-opacity", 0.8)
        .on("mouseover", function (event: MouseEvent, d: DadosMapa) {
          d3.select<SVGCircleElement, DadosMapa>(this)
            .transition()
            .duration(200)
            .attr("r", Math.min(radiusScale(d.quantidade_alunos) * 1.2, maxRadius));
            
          tooltip
            .style("opacity", 1)
            .html(
              `${d.naturalidade} - ${d.estado}<br>${d.quantidade_alunos} Alunos`,
            )
            .style("left", `${event.pageX - 80}px`)
            .style("top", `${event.pageY - 80}px`);
        })
        .on("mouseout", function (event, d) {  
          console.log("Mouse saiu da marcação:", d);
        
          if (!d || d.quantidade_alunos === undefined) return;
        
          d3.select<SVGCircleElement, DadosMapa>(this)
            .transition()
            .duration(200)
            .attr("r", Math.max(radiusScale(d.quantidade_alunos), 3)) 
            .attr("fill-opacity", 0.8);
        
          tooltip.style("opacity", 0); 
        });

      function zoomed(event: d3.D3ZoomEvent<SVGSVGElement, unknown>) {
        const { transform } = event;

        svg
          .selectAll<SVGPathElement, GeoJSON.Feature>("path")
          .attr("transform", transform.toString());

        svg
          .selectAll<SVGCircleElement, DadosMapa>("circle")
          .attr("cx", (d) =>
            transform.applyX(projection([d.longitude, d.latitude])![0]),
          )
          .attr("cy", (d) =>
            transform.applyY(projection([d.longitude, d.latitude])![1]),
          );
      }
    })
    .catch((error) => {
      console.error("Erro no mapa: ", error);
    });
};

export const MapaAlunos = ({ dados }: { dados: DadosMapa[] }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    carregaGraficoMapaBrasil(dados, svgRef);
  }, [dados]);
  return (
    <div id="mapa-brasil-container" className="h-full w-full">
      <svg id="mapa-brasil" ref={svgRef}></svg>
    </div>
  );
};
