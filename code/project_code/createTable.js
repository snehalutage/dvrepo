function createTable(otcData, divId) {
  var table = d3.select(divId).append('table');
  console.log(otcData)
  console.log("KEYS:", Object.keys(otcData[0]))
  var keys = Object.keys(otcData[0])

  var otherOpacityHover = "0.1"
  
  var thead = table.append("thead");
  var tbody = table.append("tbody");

  thead.append("tr")
    .selectAll("th")
    .data(keys)
    .join("th")
    .text(d => d);

  var drugs = tbody.selectAll('tr.drug')
    .data(otcData)
    .join('tr')
    .attr('class','drug')
  
  var dataItem = otcData[0];
  console.log("DATA ITEM:", keys.map(k => dataItem[k]));
  
  drugs.selectAll('td')
    .data(d => keys.map(k => d[k]))
    .join('td')
    .text(d=>d)//function(d) { if (d === "Anti-Diarrheal") { return d + " (AD)"} else { return d+" ("+d[0]+")"}});
  
drugs.on('mouseover', function(event, d) {
    d3.select(event.currentTarget)
      .classed('highlight', true)
  
  d3.selectAll('#chart circle').filter(dd => dd.data.name === d.OTC_Drug_Type)
     .classed('highlight', true)
    
d3.selectAll('#chart circle').filter(dd => dd.data.name !== d.OTC_Drug_Type)
     .style('fill-opacity', otherOpacityHover)

  d3.selectAll('#linechart path.line').filter(dd => dd.name === d.OTC_Drug_Type)
     .classed('highlight', true)

  d3.selectAll('#linechart path.line').filter(dd => dd.name !== d.OTC_Drug_Type)
  .style('opacity', otherOpacityHover);

})
  
drugs.on('mouseout', function(event, d) {
    d3.select(event.currentTarget)
      .classed('highlight', false)
    
    d3.selectAll('#chart circle').filter(dd => dd.data.name === d.OTC_Drug_Type)
        .classed('highlight', false)

    d3.selectAll('#linechart path.line').filter(dd => dd.name === d.OTC_Drug_Type)
        .classed('highlight', false)

    d3.selectAll('#chart circle').filter(dd => dd.data.name !== d.OTC_Drug_Type)
        .style('fill-opacity', 0.7);

    d3.selectAll('#linechart path.line').filter(dd => dd.name !== d.OTC_Drug_Type)
        .style('opacity', 0.85);
  })
}