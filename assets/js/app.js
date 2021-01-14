// Creating the svg

var svgWidth = 900;
var svgHeight = 500;

var margin ={
    top : 20,
    bottom: 80,
    left: 100,
    right: 40
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.bottom - margin.top;

// Creating the scatter plot

// Creating the svg wrapper
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Creating a svg group called g
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);



// Reading the csv file
d3.csv("assets/data/data.csv").then(function(healthData){
    
    // Setting the data to be numbers instead of a string
    healthData.forEach(function(data){
        data.age = +data.age;
        data.smokes = +data.smokes;
    });

    // Setting the x Scale
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.age) * 0.95 ,d3.max(healthData, d => d.age) * 1.05])
        .range([0,width]);

    // Setting the y scale
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.smokes) * 0.9, d3.max(healthData, d => d.smokes) * 1.1])
        .range([height,0]);
    
    // Creating the bottom and left axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // The x axis
    chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // The y axis
    chartGroup.append("g")
        .call(leftAxis);

    // The Scatter plot
    chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", 10)
        .attr("fill", "gray");

    // The text on top of the scatter plot points
    chartGroup.append("g")
        .selectAll("text")
        .data(healthData)
        .enter()
        .append("text")
        .text(function(d){
            return d.abbr;
        })
        .attr("x",function(d){
            return xLinearScale(d.age);
        })
        .attr("y",function(d){
            return yLinearScale(d.smokes)
        })
        .attr("dx","-.5em")
        .attr("dy",".25em")
        .attr("font-size","8px")
        .attr("fill","black");

        chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "4em")
        .classed("axis-text", true)
        .text("Smoking");

        var labelsGroup = chartGroup.append("g")
            .attr("transform",`translate(${width/2}, ${height + 15})`)
        
        var povertylabel = labelsGroup.append("text")
            .attr("x",0)
            .attr("y",40)
            .attr("value", "poverty")
            .classed("axis-text",true)
            .text("Poverty");

        var ageLabel = labelsGroup.append("text")
            .attr("x", 0)
            .attr("y",20)
            .attr("value","age")
            .classed("axis-text", true)
            .text("Age");
        
});