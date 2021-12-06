let selected = [] // lista de herramientas seleccionadas
let all_shown = true // se estan mostrando todas las lineas con circulos

const WIDTH2 = 800;
const HEIGHT2 = 500
const margin_chart = {
  top: 100,
  bottom: 50,
  left: 100,
  right: 50,
};

const width2 = WIDTH2 - margin_chart.left - margin_chart.right;
const height2 = HEIGHT2 - margin_chart.top - margin_chart.bottom;

const rankingSVG = d3
  .select(".chart-container")
  .append("svg")
  .attr("width", WIDTH2)
  .attr("height", HEIGHT2);

const chart_leyend_container = document.getElementsByClassName('chart-leyend-container')

// Titulo
const title = rankingSVG
    .append("text")
    .attr("transform", `translate(${WIDTH2/2}, ${margin_chart.top/2})`)
    .attr('dy', '0.5em')
    .attr("class", "chart-title")
    .style('text-anchor', 'middle')
    .style('opacity', 0)

// Ejes
const xAxisContainer = rankingSVG.append("g").attr("transform", `translate(${margin_chart.left}, ${margin_chart.top + height2})`)
const yAxisContainer = rankingSVG.append("g").attr("transform", `translate(${margin_chart.left}, ${margin_chart.top })`)

xAxisContainer.attr("class", "x-axis")
yAxisContainer.attr("class", "y-axis")

// Eje X
const xScale = d3.scaleLinear()
                .range([0, width2])
// Eje Y
const yScale = d3.scaleLinear()
                .range([height2, 0])
                .nice()

// Generador de linea
const lineGenerator = d3.line()
                        .x(d => xScale(d.year))
                        .y(d => yScale(d.rank))
                        .curve(d3.curveLinear)

const colorScale = d3
            .scaleOrdinal()
            .range(colors.slice(0, colors.length))      

const linesContainer = rankingSVG.append("g").attr("transform", `translate(${margin_chart.left}, ${margin_chart.top})`)
const circleContainer = rankingSVG.append("g").attr("transform", `translate(${margin_chart.left}, ${margin_chart.top})`)   

const getRanking = (data) => {
    return data.rankings
}

const hoverIn = (d) => {
    d3.selectAll('.line').filter((d2) => d2.id != d.id)
        .transition()
        .duration(200)
        .style('opacity', 0.2)

    d3.selectAll('.circle').filter((d2) => d2.id != d.id)
        .transition()
        .duration(200)
        .style('opacity', 0.2)
    
    d3.selectAll('.line').filter((d2) => d2.id == d.id)
        .transition()
        .duration(200)
        .style('opacity', 1)
    
    d3.selectAll('.circle').filter((d2) => d2.id == d.id)
        .transition()
        .duration(200)
        .style('opacity', 1)

    d3.selectAll(`#leyend-${d.id}`).transition().duration(200).style('color', colorScale(d.id))

} 

const hoverOut = (d) => {

    d3.selectAll('.line').filter((d2) => d2.id == d.id)
        .transition()
        .duration(200)
        .style('opacity', 1)

    d3.selectAll('.circle').filter((d2) => d2.id == d.id)
        .transition()
        .duration(200)
        .style('opacity', 1)
    
    d3.selectAll('.line').filter((d2) => d2.id != d.id)
        .transition()
        .duration(200)
        .style('opacity', 1)
    
    d3.selectAll('.circle').filter((d2) => d2.id != d.id)
        .transition()
        .duration(200)
        .style('opacity', 1)

    d3.selectAll(`#leyend-${d.id}`).transition().duration(200).style('color', "white")

}


const graphLines = (data) => {

    data.forEach(d => {
        node = document.createElement("div")
        node.className = "chart-leyend-item";
        node.id = `leyend-${d.id}`;
        node.name=  d.name
        // le agregamos el id al nodo y al texto para poder identificar cualquiera como lo mismo con el click en la leyenda
        node.innerHTML = 
        `<div class="circle-leyend" id="leyend-${d.id}" style="background-color: ${colorScale(d.id)}"></div>
        <div class="chart-leyend-item-text" id="leyend-${d.id}">${d.name}</div>`        // style="color: ${colorScale(d.name)}"
        chart_leyend_container[0].appendChild(node)
    })

    title
        .transition()
        .duration(2000)
        .style('opacity', 1)
        .attr("fill", "white")
        .attr('font-size', '1.2em')
        .text('🏆 Ranking')
   
    // Eje X
    xScale.domain([2015, 2021])
    const xAxis = d3.axisBottom(xScale)
    xAxisContainer
        .transition()
        .duration(500) 
        .call(xAxis.tickFormat(d3.format("d")).ticks(6).tickPadding([20]))
    
    // Eje Y
    const tickLabels = ["No ranking ", "#10", "#9", "#8", "#7", "#6", "#5", "#4", "#3", "#2", "#1"]
    yScale.domain([11, 1]).nice()
    const yAxis = d3.axisLeft(yScale)
    yAxisContainer
        .transition()
        .duration(500)
        .call(yAxis.tickFormat(function(d,i){ return tickLabels[i] }).tickPadding([15]))

    // Generamos las lineas
    linesContainer
        .selectAll('path')
        .data(data, (d) => d.name)
        .join(
            enter => { enter
                .append('path')
                .attr('class', 'line')
                .attr('id', (d) => `path-${d.id}`)
                .attr('d', (d) => lineGenerator(getRanking(d)))
                .attr("fill", "none")
                .attr('stroke-color', (d) => colorScale(d.id))
                .on("mouseenter", (e, d) => {
                    if (all_shown){
                        hoverIn(d)
                    }
                    
                })
                .on("mouseleave", (e, d) => {
                    if (all_shown){
                        hoverOut(d)
                    }
                })
                .transition()
                .duration(500)
                .attr("stroke", (d) => colorScale(d.id))
                .attr("stroke-width", 3)
                }
            )
}   

// Generamos los circulos    
const addCircles = (data) => {
    circleContainer.selectAll('circle')
        .data(data, (d) => d.name)
        .join(
            (enter) => { enter 
                .append('circle')
                .attr('class', 'circle')
                .attr('id', (d) => `circle-${d.id}`)
                .attr('fill', 'transparent')
                .attr('cx', (d) => xScale(d.year))
                .attr('cy', (d) => yScale(d.value))
                .attr('r', 0)
                .on("mouseenter", (e, d) => {
                    if (all_shown){
                        hoverIn(d)
                    }
                    
                })
                .on("mouseleave", (e, d) => {
                    if (all_shown){
                        hoverOut(d)
                    }
                    
                })
                .transition()
                .duration(1000)
                .attr('r', 9)
                .attr('fill', (d) => {
                    if (d.value == 11) {
                        return '#808080'
                    }else {
                        return colorScale(d.id)
                    }
                })
            }
        )
}

const processingDataCircles = (datosRanking) => {
    const circleData = []
    datosRanking.forEach(d => {
        d.rankings.forEach(e => {
            let item = {}
            item['name'] = d.name
            item['id'] = d.id
            item['year'] = e.year
            item['value'] = e.rank
            circleData.push(item)
          })
    })
    return circleData
}

d3.json("./ranking.json").then((datosRanking) => {
    
    graphLines(datosRanking)

    const circle_data = processingDataCircles(datosRanking)
    addCircles(circle_data)

    // Click sobre leyendas
    const leyend_items = document.querySelectorAll('.chart-leyend-item-text')
    
    leyend_items.forEach(d => {

        d.addEventListener('click', (e) => {
            
            all_shown = false
            const target_id = e.target.id.split(/-(.+)/)[1] // clean 
            const text = d3.selectAll(`#leyend-${target_id}`)

            let name_ 
            name_ = e.target.innerHTML

            text.nodes()[2].style.color = colorScale(target_id)

            if (!selected.includes(target_id)){
                selected.push(target_id)
                text.nodes()[2].style.color = colorScale(target_id)
            } else {
                const index = selected.indexOf(target_id);
                if (index > -1) {
                    selected.splice(index, 1);
                }
                text.nodes()[2].style.color = 'white'
            }

            d3.selectAll('.line')
                .filter((d2) => selected.includes(d2.id))
                .transition()
                .duration(250)
                .style('opacity', 1)
            
            d3.selectAll('.line')
                .filter((d2) => !selected.includes(d2.id))
                .transition()
                .duration(250)
                .style('opacity', 0)  
        })
    })

    d3.select('.btn-show-all')
        .on("click", (d) => {

            selected = []

            all_shown = true
            d3.selectAll('.chart-leyend-item-text').style('color', 'white')

            d3.selectAll('.line')
                .transition()
                .duration(500)
                .style('opacity', 1)

            d3.selectAll('.circle')
                .transition()
                .duration(500)
                .style('opacity', 1)
        })
        .on("mouseover", () => {
            d3.select('.btn-show-all').style('color', '#808080')
        })
        .on("mouseleave", () => {
            d3.select('.btn-show-all').style('color', 'white')
        })

})