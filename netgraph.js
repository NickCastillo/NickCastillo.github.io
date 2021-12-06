const WIDTH = 950;
const HEIGHT = 800;

const net_margin = {
  top: 50,
  bottom: 50,
  left: 50,
  right: 50,
};

const width = WIDTH - net_margin.left - net_margin.right;
const height = HEIGHT - net_margin.top - net_margin.bottom;

const netGraph = d3
  .select(".netgraph-container")
  .append("svg")
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

const leyend_language = d3.select('#leyend-language')
const leyend_framework = d3.select('#leyend-framework')
const leyend_platform = d3.select('#leyend-platform')
const leyend_database = d3.select('#leyend-database')
const leyend_showall = d3.select('#leyend-showall')

leyend_language
    .on("mouseenter", (e, i) => {
        d3.selectAll('circle').filter((d) => d.type === "Language").attr("r", 11)
        leyend_language.style('opacity', '0.9')
    })
    .on("mouseleave", (e, i) => {
        d3.selectAll('circle').filter((d) => d.type === "Language").attr("r", 6)
        leyend_language.style('opacity', '1')
    })

leyend_framework
.on("mouseenter", (e, i) => {
    d3.selectAll('circle').filter((d) => d.type === "Framework").attr("r", 11)
    leyend_framework.style('opacity', '0.9')
})
.on("mouseleave", (e, i) => {
    d3.selectAll('circle').filter((d) => d.type === "Framework").attr("r", 6)
    leyend_framework.style('opacity', '1')
})

leyend_platform
    .on("mouseenter", (e, i) => {
        d3.selectAll('circle').filter((d) => d.type === "Platform").attr("r", 11)
        leyend_platform.style('opacity', '0.9')
    })
    .on("mouseleave", (e, i) => {
        d3.selectAll('circle').filter((d) => d.type === "Platform").attr("r", 6)
        leyend_platform.style('opacity', '1')
})

leyend_database
    .on("mouseenter", (e, i) => {
        d3.selectAll('circle').filter((d) => d.type === "Database").attr("r", 11)
        leyend_database.style('opacity', '0.9')
    })
    .on("mouseleave", (e, i) => {
        d3.selectAll('circle').filter((d) => d.type === "Database").attr("r", 6)
        leyend_database.style('opacity', '1')
})

const circleColors = (type) => {
    switch (type) {
        case "Language":
            return LANGUAJE_COLOR
        case "Framework":
            return FRAMEWORK_COLOR
        case "Platform":
            return PLATFORM_COLOR
        case "Database":
            return DATABASE_COLOR
    }
    return 
}

const iniciarSimulacion = (nodos, enlaces) => {

    const simulacion = d3
        .forceSimulation(nodos)
        .force(
          "enlaces",
          d3
            .forceLink(enlaces)
            .id((d) => d.name)
            .distance(10)
        )
        .force("carga", d3.forceManyBody().strength(8))
        .force("colision", d3.forceCollide(40))
        .force("centro", d3.forceCenter(width / 2, height / 2))
        .force("x", d3.forceX((d) => { 
            switch (d.group) {
                case 1:
                    return width / 3
                case 2:
                    return width / 4
                case 3:
                    return width / 2
                case 4:
                    return width / 5
                case 5:
                    return width / 2 
                case 6:    
                    return width / 3
                case 7:
                    return width / 5
                case 8: 
                    return width / 2
            }
            return 0
        }))
        .force("y", d3.forceY((d) => { 
            switch (d.group) {
                case 1:
                    return height + 100
                case 2:
                    return height
                case 3:
                    return height
                case 4:
                    return height
                case 5: 
                    return height
                case 6:    
                    return height
                case 7:
                    return height 
                case 8: 
                    return height 
            }
            return 0
        }))

        simulacion.alphaTarget(0.1).restart();    

        const inicioArrastre = (evento) => {
        if (evento.active === 0) {
            simulacion.alphaTarget(0.1).restart();
        }
        d3.select(`#${evento.subject.id}`)
            evento.subject.fx = evento.subject.x;
            evento.subject.fy = evento.subject.y;
        };


        const arrastreando = (evento) => {
            evento.subject.fx = evento.x;
            evento.subject.fy = evento.y;
        };


        const finArrastre = (evento) => {
            if (!evento.active) {
                simulacion.alphaTarget(0.1).restart(); 
            }
            d3.select(`#${evento.subject.id}`)
            //.attr finales
            evento.subject.fx = null;
            evento.subject.fy = null;
        }

        const drag = d3.drag()
                        .on("start", inicioArrastre)
                        .on("drag", arrastreando)
                        .on("end", finArrastre);

        const lines = netGraph
            .append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.4)
            .selectAll("line")
            .data(enlaces)
            .join("line")
            .attr('id', (d) => `line-${d.id}`)
            .attr("stroke-width", 2)
            .attr("group", (d) => d.group)
        
        const nodeContainer = netGraph
            .append("g")
            .attr("id", "nodes")
            .selectAll("g")
            .data(nodos)
            .join("g")

        const circles = nodeContainer
            .append("circle")
            .attr("r", 6)
            .attr("id", (d) => d.id)
            .attr("group", (d) => d.group)
            .call(drag)

        const texts = nodeContainer
            .append("text")
            .text((d) => d.name)
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")

        circles
            .on("mouseover", (e, i) => {
                const group_circles = circles.filter((d) => d.group === i.group)
                const group_lines = lines.filter((d) => d.group === i.group)
                
                group_circles
                    .transition()
                    .duration(300)
                    .attr("r", 11)
                    .attr("stroke-width", 0.2)

                group_lines
                    .transition()
                    .duration(300)
                    .attr("stroke", "white")
                    .style("opacity", 1)
            })
            .on("click", (d, i) => {
                
                const group_circles = circles.filter((d) => d.group === i.group)
                const group_lines = lines.filter((d) => d.group === i.group)

                group_circles
                    .transition()
                    .duration(300)
                    .attr("r", 11)
                    .attr("stroke-width", 0.2)

                group_lines
                    .transition()
                    .duration(300)
                    .attr("stroke", "white")
                    .style("opacity", 1)

                const group_circles_not = d3.selectAll('circle').filter((d) => d.group != i.group && d.group)
                const group_line_not = lines.filter((d) => d.group != i.group)
                const group_texts_not = texts.filter((d) => d.group != i.group)

                group_circles_not
                    .transition()
                    .duration(1000)
                    .attr("r", 0);

                group_line_not
                    .transition()
                    .duration(1000)
                    .attr("stroke", "transparent");

                group_texts_not
                    .transition()
                    .duration(1000)
                    .attr("opacity", 0);

            })
            .on("mouseleave", (d, i) => {

                const group_circles = d3.selectAll('circle').filter((d) => d.group === i.group)
                const group_lines = d3.selectAll('line').filter((d) => d.group === i.group)

                group_circles
                    .transition()
                    .duration(300)
                    .attr("r", 6)
                    .attr("stroke-width", 0)

                group_lines
                    .transition()
                    .duration(300)
                    .attr("stroke", "#999")
                    .style("opacity", 1)
        })

        const rank_names = ['javascript', 'python', 'sql', 'html-css', 'java', 'nodejs', 'typescript', 'csharp', 'bash-shell', 'cplusplus', 'php', 'c', 'ruby', 'angular']

        const paintSelectedNodeText = (d) => {
        
            if (selected.includes(d.id) || all_shown && rank_names.includes(d.id)) {
                return colorScale(d.id)
            } else {
                return 'white'
            }
        }

        const nodeTextSize = (d) => {
            if (selected.includes(d.id) || all_shown && rank_names.includes(d.id)) {
                return '15px'
            } else {
                return '12px'
            }
        }

        leyend_showall
            .on("click", (e, i) => {
                circles
                    .transition()
                    .duration(500)
                    .attr("r", 6)
                    .attr("stroke-width", 0)

                lines
                    .transition()
                    .duration(1000)
                    .attr("stroke", "#999")
                    .style("opacity", 1)
                
                texts
                    .transition()
                    .duration(500)
                    .attr("opacity", 1)
            })
            .on("mouseover", (e, i) => {
                leyend_showall
                    .style("opacity", 0.9)
            })
            .on("mouseleave", (e, i) => {
                leyend_showall
                    .style("opacity", 1)
            })

        simulacion.on("tick", (d) => {
            
            texts
                .attr("x", (d) => d.x + 10)
                .attr("y", (d) => d.y - 15)
                .style("fill", (d) => paintSelectedNodeText(d))
                .attr("font-size", (d) => nodeTextSize(d))

            circles
                .attr("cx", (d) => d.x)
                .attr("cy", (d) => d.y)
                .attr("fill", (d) => circleColors(d.type))
                //.attr("stroke", (d) => paintSelectedNodeStroke(d))
                .attr("stroke-width", 2.5)

            lines
                .attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y)
                .attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y)
                
            d3.selectAll('circle').on('dblclick', (d, i) => {
                console.log('Double clicked')
            })
        });

    };
    

    d3.json("./relations.json")
        .then((datos) => {
            const nodos = datos.nodos;
            const enlaces = datos.enlaces;
            iniciarSimulacion(nodos, enlaces);
        })
        .catch((error) => {
        console.log(error);
        });