"use client";

import React, { useEffect } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coordenada } from "@/lib/ppg/definitions";

interface MapaBrasilProps {
  coordenadasCirculo: Coordenada[];
  maior: number;
  menor: number;
  idPpg: string;
}

const MapaBrasil: React.FC<MapaBrasilProps> = ({
  coordenadasCirculo,
  maior,
  menor,
  idPpg,
}) => {
  const normaliza = (val: number, max: number, min: number): number => {
    if (max - min === 0) return 1;
    return (val - min) / (max - min);
  };

  useEffect(() => {
    const width = 300;
    const height = 300;

    const svg = d3
      .select<SVGSVGElement, unknown>("#mapa-brasil")
      .attr("width", '100%') 
      .attr("height", "100%") 
      .attr("viewBox", "0 0 400 400")
      .attr("preserveAspectRatio", "xMinYMin meet")

    const projection = d3
      .geoMercator()
      .center([-55, -10])
      .scale(500)
      .translate([width / 2, height / 2 - 50]);

    const path = d3.geoPath().projection(projection);

    d3.json<any>("/br.json")
      .then((data) => {
        const brasil = topojson.feature(data, data.objects.estados);

        svg
          .selectAll<SVGPathElement, any>("path")
          .data(brasil.features)
          .enter()
          .append("path")
          .attr("d", path as any)
          .attr("fill", "#abc8e8")
          .attr("stroke", "white");

        const zoom = d3
          .zoom<SVGSVGElement, unknown>()
          .scaleExtent([1, 8])
          .on("zoom", zoomed);

        svg.call(zoom);

        const tooltip = d3
          .select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("opacity", 0)
          .style("position", "absolute")
          .style("background", "#fff")
          .style("padding", "5px")
          .style("border-radius", "5px")
          .style("box-shadow", "0px 0px 5px rgba(0,0,0,0.3)");

        svg
          .selectAll<SVGCircleElement, Coordenada>("circle")
          .data(coordenadasCirculo)
          .enter()
          .append("circle")
          .attr("cx", (d) => projection([d.longitude, d.latitude])![0])
          .attr("cy", (d) => projection([d.longitude, d.latitude])![1])
          .attr("r", (d) => normaliza(d.indprod, maior, menor) * 15)
          .attr("fill", (d) => {
            if (d.id === idPpg) return "#a8a29e";
            else if (d.status === "Pública Federal") return "#c084fc";
            else if (d.status === "Pública Estadual") return "#22d3ee";
            return "#fbbf24";
          })
          .attr("stroke", "white")
          .attr("fill-opacity", 0.4)
          .on("mouseover", function (event, d) {
            d3.select(this).attr("r", normaliza(d.indprod, maior, menor) * 20);
            tooltip
              .style("opacity", 1)
              .html(
                `${d.nome}<br>${d.sigla} - ${d.status}<br>(${d.municipio}/${
                  d.uf
                })<br>indProd: ${d.indprod.toFixed(3)}`
              )
              .style("left", event.pageX + "px")
              .style("top", event.pageY + "px");
          })
          .on("mouseout", function () {
            d3.select(this).attr(
              "r",
              (d) => normaliza(d.indprod, maior, menor) * 15
            );
            tooltip.style("opacity", 0);
          });

        function zoomed(event: d3.D3ZoomEvent<SVGSVGElement, unknown>) {
          const { transform } = event;
          svg
            .selectAll<SVGPathElement, any>("path")
            .attr("transform", transform.toString());

          svg
            .selectAll<SVGCircleElement, Coordenada>("circle")
            .attr("cx", (d) =>
              transform.applyX(projection([d.longitude, d.latitude])![0])
            )
            .attr("cy", (d) =>
              transform.applyY(projection([d.longitude, d.latitude])![1])
            )
            .attr(
              "r",
              (d) => normaliza(d.indprod, maior, menor) * 15 * transform.k
            );
        }
      })
      .catch((error) => {
        console.error("Erro no mapa: ", error);
      });
  }, [coordenadasCirculo, maior, menor, idPpg]);

  return (
    <Card>
      <CardHeader>
        <CardTitle> Artigos do PPG</CardTitle>
        <CardDescription> Ranking de PPGs nota {"notaPpg"} (mesma área) </CardDescription>
      </CardHeader>
      <CardContent>
        <svg id="mapa-brasil"></svg>
      </CardContent>
    </Card>
  );
};

export default MapaBrasil;
