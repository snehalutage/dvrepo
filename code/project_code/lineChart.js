function lineChart(data, divId) {
  console.log("Line_chart Data", data)
  var width = 400;
  var height = 400;
  var margin = ({ top: 20, right: 40, bottom: 30, left: 40 });
  var duration = 250;

  var lineOpacity = "0.7";
  var lineOpacityHover = "0.85";
  var otherLinesOpacityHover = "0.1";
  var lineStroke = "1.5px";
  var lineStrokeHover = "2.5px";

  var circleOpacity = '0.85';
  var circleOpacityOnLineHover = "0.25"
  var circleRadius = 5;
  var circleRadiusHover = 6;

  filtered = data.map(d => d.values)

  v1 = filtered.map(function (d) {
    return d.map(dd => dd.value)
  })
  all_values = Array.prototype.concat.apply([], v1);
  max_value = Math.max.apply(Math, all_values)


  /* Format Data */
  var parseDate = d3.timeParse("%Y");
  data.forEach(function (d) {

    d.values.forEach(function (d) {

      d.date = parseDate(d.date);
      d.value = +d.value;
    });
  });


  /* Scale */
  var xScale = d3.scaleTime()
    .domain(d3.extent(data[0].values, d => d.date))
    // .domain([2013,2020])
    .range([margin.left, width - margin.right]);

  var yScale = d3.scaleLinear()
    // .domain([0, d3.max(data[0].values, d => d.value)]).nice()
    .domain([0, max_value]).nice()
    .range([height - margin.bottom, margin.top])

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  xGrid = (g) => g
    .attr('class', 'grid-lines')
    .selectAll('line')
    .data(xScale.ticks())
    .join('line')
    .attr('x1', d => xScale(d))
    .attr('x2', d => xScale(d))
    .attr('y1', margin.top)
    .attr('y2', height - margin.bottom)

  yGrid = (g) => g
    .attr('class', 'grid-lines')
    .selectAll('line')
    .data(yScale.ticks())
    .join('line')
    .attr('x1', margin.left)
    .attr('x2', width - margin.right)
    .attr('y1', d => yScale(d))
    .attr('y2', d => yScale(d))

  /* Add SVG */
  var svg = d3.select(divId).append("svg")
    .attr("viewBox", [0, 0, margin.right + width + margin.left, margin.bottom + height + margin.top]);

  /* Add line into SVG */
  var line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.value));

  let lines = svg.append('g')
    .attr('class', 'lines');

  lines.selectAll('.line-group')
    .data(data).enter()
    .append('g')
    .attr('class', 'line-group')
    .style("stroke-width", lineStroke)
    .on("mouseover", function (event, d) {
      svg.append("text")
        .attr("class", "title-text")
        .style("fill", "black")
        .text(d.name)
        .attr("text-anchor", "middle")
        .attr("x", (width) / 2)
        .attr("y", 12)
        .attr("font-size", "1em");
    })
    .on("mouseout", function (d) {
      svg.select(".title-text").remove();
    })
    .append('path')
    .attr('class', 'line')
    .attr('d', d => line(d.values))
    .style('stroke', (d, i) => color(i))
    .style('opacity', lineOpacity)
    .on("mouseover", function (d) {
      d3.selectAll('.line')
        .style('opacity', otherLinesOpacityHover);
      d3.selectAll('.circle')
        .style('opacity', circleOpacityOnLineHover);
      d3.select(this)
        .style('opacity', lineOpacityHover)
        .style("stroke-width", lineStrokeHover)
        .style("cursor", "pointer");
    })
    .on("mouseout", function (d) {
      d3.selectAll(".line")
        .style('opacity', lineOpacity);
      d3.selectAll('.circle')
        .style('opacity', circleOpacity);
      d3.select(this)
        .style("stroke-width", lineStroke)
        .style("cursor", "none");
    });


  /* Add circles in the line */
  lines.selectAll("circle-group")
    .data(data).enter()
    .append("g")
    .attr("class", d => d.name[1])
    .style("fill", (d, i) => color(i))
    .selectAll("circle")
    .data(d => d.values).enter()
    .append("g")
    .attr("class", "circle")
    .on("mouseover", function (event, d) {
      d3.select(this)
        .style("cursor", "pointer")
        .append("text")
        .attr("class", "text")
        .text("Value :" + d.value)
        .attr("x", d => xScale(d.date) + 5)
        .attr("y", d => yScale(d.value) - 10);
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .style("cursor", "none")
        .transition()
        .duration(duration)
        .selectAll(".text").remove();
    })
    .append("circle")
    .attr("cx", d => xScale(d.date))
    .attr("cy", d => yScale(d.value))
    .attr("r", circleRadius)
    .style('opacity', circleOpacity)
    .on("mouseover", function (d) {
      d3.select(this)
        .transition()
        .duration(duration)
        .attr("r", circleRadiusHover);
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .transition()
        .duration(duration)
        .attr("r", circleRadius);
    });


  /* Add Axis into SVG */
  var xAxis = d3.axisBottom(xScale).ticks(5);
  var yAxis = d3.axisLeft(yScale).ticks(10);

  svg.append('g').attr('transform', `translate(0,${height - margin.bottom})`).call(xAxis)
  svg.append('g').attr('transform', `translate(${margin.left},0)`).call(yAxis)
  svg.append('g').call(xGrid)
  svg.append('g').call(yGrid)
  //x
  svg.append("text")
    .attr("transform", "translate(" + (width / 2) + " ," + (height - margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("Year");

  //Y-axis label
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -6)
    .attr("x", margin.left - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Avg NADAC per unit price");

}