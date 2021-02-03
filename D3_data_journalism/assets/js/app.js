// The code for automatically resizing the Chart and set SVG.
function chartResize() {

    var svgArea = d3.select("body").select("svg");

    if(!svgArea.empty()) {
        svgArea.remove();
    }

    var svgWidth = 960;
    var svgHeight = 800;
    

    var margin = {top: 50,
        bottom: 50,
        right: 50,
        left: 50
      };
    
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;


// Append SVG element
    var chart = d3.select('#scatter')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight);


// Append grop element  
    var chartGroup = chart.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);


// Read CSV
    d3.csv('assets/data/data.csv').then(function (baseData) {

// Parse Data
    baseData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
});

// Create Scales 
    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(baseData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(baseData, d => d.healthcare)])
        .range([height, 0]);

// Create axes
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

// Append Axis 
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

    chartGroup.append("g")
    .call(yAxis);

// Append Circle
    var circlesGroup = chartGroup.selectAll("circle")
    .data(baseData)
    .enter()
    .append("circle")
    .classed("stateCircle", true)
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "17") 
    .attr("opacity", "2.0");
    
// Circle ChartGroup
    chartGroup.selectAll()
    .data(baseData)
    .enter()
    .append("text")
    .classed(".aText", true)
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .style("text-anchor", "middle")
    .style("alignment-baseline", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr));

// Append tooltip
    var toolTip = d3.tip()
    .attr("data-toggle", "tooltip")
    .style("background", "red")
    .style("color", "white")
    .style("text-align", "center")
    .style("border-radius", "10px")
    .style("padding", "px 11px")
    .html(function (d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}%`);
    });

    chartGroup.call(toolTip);

// Create Mouseover event listner
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this)
          });
    // Create Mouseout even listner
    circlesGroup.on("mouseout", function (data) {
        toolTip.hide(data);
    });

// X Axis Labels 
chartGroup.append("text")
    .classed("aText", true)
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .text("Lack Healthcare (%)");

// Y Axis Labels 
chartGroup.append("text")
    .classed("aText", true)
    .attr("transform", `translate(${width / 2}, ${height + margin.top - 10})`)
    .text("In Poverty (%)");


}).catch(function (error) {
console.log(error);
});

}

// Function calling
chartResize();

// When the browser window is resized, makeResponsive() is called.
d3.select(window).on("resize", chartResize);

