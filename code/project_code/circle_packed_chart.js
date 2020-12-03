function circle_packed_chart(data,divId,width,height)
{
  
  console.log("Bubble Chart Data :",data)
  var years = [...new Set( data.map(obj => obj.group)) ];
  var years = years.map(Number);
  //console.log(years)

  pack = data => d3.pack()
    .size([width - 2, height - 2])
    .padding(3)
  (d3.hierarchy({children: data})
    .sum(d => d.value))

  const root = pack(data);

  color = d3.scaleOrdinal(data.map(d => d.group), d3.schemeCategory10)

  format = d3.format(",d")

  var margin = { top: 20, bottom: 10, left: 50, right: 100 };
  var svg = d3.select(divId).append("svg")
     .attr("viewBox", [0, 0, width + margin.left , height + margin.top + margin.bottom])
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle");

  const leaf = svg.selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`)
    .on("mouseover", function() { d3.select(this).attr("stroke", "#000").attr("stroke-width","2px"); })
    .on("mouseout", function() { d3.select(this).attr("stroke", null); })


  leaf.append("circle")
      .attr("r", d => d.r)
      .attr("fill-opacity", 0.7)
      .attr("fill", d => color(d.data.group))
      .on("mouseover", function(event,d) {
        svg.append("text")
          .attr("class", "title-text")
          .style("fill", "black")        
          .text(d.data.title)
          .attr("text-anchor", "middle")
          .attr("x",(width)/2)
          .attr("y", 25)
          .attr("font-size","2em");

        d3.selectAll('#linechart path.line').filter(dd => dd.name === d.data.name)
          .classed('highlight', true)

        d3.selectAll('#table tr').filter(function(dd){ if (dd !== undefined) { if (dd.OTC_Drug_Type === d.data.name){return dd}}}) 
          .classed('highlight', true)
      })
    .on("mouseout", function(event,d) {
        svg.select(".title-text").remove()

        d3.selectAll('#linechart path.line').filter(dd => dd.name === d.data.name)
          .classed('highlight', false)

          d3.selectAll('#table tr').filter(function(dd){ if (dd !== undefined) { if (dd.OTC_Drug_Type === d.data.name){return dd}}})
          .classed('highlight', false)
      })

 // leaf.append("clipPath")
 //     .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
   // .append("use")
    //  .attr("xlink:href", d => d.leafUid.href);

  leaf.append("text")
//      .attr("clip-path", d => d.clipUid)
    .selectAll("tspan")
    .data(function(d) {
        if (d.data.name === "Anti-Diarrheal")
        {
            return ("AD ").split(/(?=[A-Z][a-z])|\s+/g)
        }
        else
        {
            return (d.data.name[0]).split(/(?=[A-Z][a-z])|\s+/g)
        }
    })
    .join("tspan")
      .attr("class","drugname")
      .attr("x", 0)
      .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
      .text(d => d)
      .style("font-size","1.5em");

  leaf.append("title")
      .text(d => `${d.data.title === undefined ? "" : `${d.data.title}`}`);

 //Svg group element for the legend rect and text
 var legend = svg.append("g")
 .selectAll("g")
 .data(years.sort())
 .join("g")
 .attr("transform", function (d, i) { return `translate(-${margin.left},${(i + 1) * margin.top})` });

//Rect for each value
legend.append("rect")
 .attr("x", width - 20)
 .attr("width", 19)
 .attr("height", 19)
 .attr("fill", color);

// Text element for the legend rect
legend.append("text")
 .attr("x", width + 20)
 .attr("y", 10)
 .attr("dy", "0.2em")
 .style("font-size","1.5em")
 .text(function (d) { return d; });

}
