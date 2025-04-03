"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2, ZoomIn, ZoomOut } from "lucide-react";

export default function GrafoColaboracao({ dadosColaboracao, forca }) {
  const [telaCheia, setTelaCheia] = useState(false);
  const [highlightedNode, setHighlightedNode] = useState(null); // Track the highlighted node
  const graphRef = useRef(null);
  const { nodes, links } = dadosColaboracao;

  const toggleMaximize = () => {
    const graphElement = graphRef.current;

    if (!telaCheia) {
      if (graphElement.requestFullscreen) {
        graphElement.requestFullscreen();
      } else if (graphElement.mozRequestFullScreen) {
        graphElement.mozRequestFullScreen();
      } else if (graphElement.webkitRequestFullscreen) {
        graphElement.webkitRequestFullscreen();
      } else if (graphElement.msRequestFullscreen) {
        graphElement.msRequestFullscreen();
      }
      setTelaCheia(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setTelaCheia(false);
    }
  };

  const destacarNosEArestas = (node, links, link, text) => {
    const nodeId = node.data()[0].id;

    // If the node is already highlighted, reset the highlights
    if (highlightedNode === nodeId) {
      resetHighlight(link, text);
      setHighlightedNode(null);
      return;
    }

    setHighlightedNode(nodeId);

    // Highlight the links associated with the selected node
    link
      .style("stroke", (link_d) =>
        link_d.source.id === nodeId || link_d.target.id === nodeId ? "#d97706" : "#999"
      )
      .style("stroke-width", (link_d) =>
        link_d.source.id === nodeId || link_d.target.id === nodeId ? 2 : 0.6
      );

    // Highlight the node labels
    text.style("opacity", (label_d) => (label_d.id === nodeId ? 1 : 0.5));

    // Get the connected nodes
    const connectedNodes = new Set();
    connectedNodes.add(nodeId);
    links.forEach((link_d) => {
      if (link_d.source.id === nodeId) {
        connectedNodes.add(link_d.target.id);
      } else if (link_d.target.id === nodeId) {
        connectedNodes.add(link_d.source.id);
      }
    });

    // Update the opacity of the nodes based on whether they are connected
    d3.selectAll("circle")
      .each(function (d) {
        const currentNode = d; // Correctly reference the data associated with this circle
        d3.select(this)
          .style("opacity", connectedNodes.has(currentNode.id) ? 1 : 0.3)
          .attr("stroke-width", connectedNodes.has(currentNode.id) ? 2 : 1);
      });
  };

  const resetHighlight = (link, text) => {
    d3.selectAll("circle")
      .style("opacity", 1)
      .attr("stroke-width", 1);

    link
      .style("stroke", "#999")
      .style("stroke-width", 0.6);

    text.style("opacity", 1);
  };

  useEffect(() => {
    if (!nodes || !links) return;

    const width = 1100;
    const height = 880;

    const graphContainer = d3.select(graphRef.current);
    graphContainer.selectAll("*").remove();

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    nodes.forEach((node, index) => {
      node.color = colorScale(index);
    });

    const svg = graphContainer
      .append("svg")
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("height", "100%");

    const zoomContainer = svg.append("g");

    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        zoomContainer.attr("transform", event.transform);
      });

    svg.call(zoom);

    d3.select("#zoom-in").on("click", () => zoom.scaleBy(svg.transition().duration(300), 1.2));
    d3.select("#zoom-out").on("click", () => zoom.scaleBy(svg.transition().duration(300), 0.8));

    const simulation = d3
      .forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d) => d.id).strength(0.1))
      .force("charge", d3.forceManyBody().strength(forca))
      .force("center", d3.forceCenter(0, 0));

    const link = zoomContainer
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    const node = zoomContainer
      .append("g")
      .attr("stroke", "#3B3B3B")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("cursor", "pointer")
      .attr("r", (d) => Math.max(4, 3 * Math.log(d.importancia || 10)))
      .attr("fill", (d) => d.color)
      .on("click", (event, d) =>
        destacarNosEArestas(d3.select(event.target), links, link, labels)
      )
      .call(
        d3
          .drag()
          .on("start", (event) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
          })
          .on("drag", (event) => {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
          })
          .on("end", (event) => {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
          })
      );

    node.append("title").text((d) => `${d.id} (${d.nome})`);

    const labels = zoomContainer
      .append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("font-size", "8px")
      .attr("dx", 10)
      .attr("dy", 4)
      .text((d) => d.id || d.nome);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

      labels
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y);
    });

    // Add a click listener to the SVG to reset the graph when clicking outside a node
    svg.on("click", (event) => {
      if (event.target.tagName !== "circle") {
        resetHighlight(link, labels);
        setHighlightedNode(null);
      }
    });
  }, [dadosColaboracao, forca]);

  return (
    <div className={telaCheia ? "fullscreen" : ""}>
      <div className="space-x-1 mb-4">
        <Button variant="outline" size="icon" id="zoom-in">
          <ZoomIn />
        </Button>
        <Button variant="outline" size="icon" id="zoom-out">
          <ZoomOut />
        </Button>
        <Button variant="outline" size="icon" onClick={toggleMaximize}>
          {telaCheia ? <Minimize2 /> : <Maximize2 />}
        </Button>
      </div>
      <div ref={graphRef} className="graph-container" style={{ height: telaCheia ? "100vh" : "100vw" }}></div>
    </div>
  );
};
