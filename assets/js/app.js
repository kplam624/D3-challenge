// Creating the svg

var svgWidth = 900;
var svgHeight = 500;

var margin ={
    top : 20,
    bottom: 40,
    left: 60,
    right: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.bottom - margin.top;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("./data/data.csv").then(function(healthData){
    
    healthData.forEach(function(data){
        data.age = +data.age;
        data.smokes = +data.smokes;
    });

    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.age) * 0.8 ,d3.max(healthData, d => d.age) * 1.2])
        .range([0,width]);

    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.smokes) * 0.8, d3.max(healthData, d => d.smokes) * 1.2])
        .range([height,0]);
    
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    chartGroup.selectAll("circle")
        .data(hairData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.age))
        .attr("cy", d => yLinearScale(d.smokes))
        .attr("r", 20)
        .attr("fill", "pink")
        .attr("opacity", ".5");

});