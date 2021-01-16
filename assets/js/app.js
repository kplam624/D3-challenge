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

var chosenXAxis = "age";
var chosenYAxis = "smokes";

function xScale(healthData, chosenXAxis){
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.95 ,d3.max(healthData, d => d[chosenXAxis]) * 1.05])
        .range([0,width]);
        
        return xLinearScale
};

function yScale(healthData, chosenYAxis){
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.9, d3.max(healthData, d => d[chosenYAxis]) * 1.1])
        .range([height,0]);
        
        return yLinearScale
};

function renderXAxes(newXScale, xAxis){
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

    return xAxis;
};

function renderYAxes(newYScale, yAxis){
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
    .duration(1000)
    .call(leftAxis);

    return yAxis;
};

// Changes the position of the circle based on the x-axis.
function renderCirclesX(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
};

// Changes the position of the circle based on the y-axis.
function renderCirclesY(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
};

function renderTextX(textGroup, newXScale, chosenXAxis){
    textGroup.transition()
     .duration(1000)
     .attr("x",function(d){
        return newXScale(d[chosenXAxis]);
     });
};

function renderTextY(textGroup, newYScale, chosenYAxis){
    textGroup.transition()
     .duration(1000)
     .attr("x",function(d){
        return newYScale(d[chosenYAxis]);
     });
};

// Reading the csv file
d3.csv("assets/data/data.csv").then(function(healthData){
    
    // Setting the data to be numbers instead of a string
    healthData.forEach(function(data){
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
        data.poverty = +data.poverty;
    });

    // Setting the x Scale
    var xLinearScale = xScale(healthData, chosenXAxis);

    // Setting the y scale
    var yLinearScale = yScale(healthData, chosenYAxis);
    
    // Creating the bottom and left axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // The x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    // The y axis
    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    // The Scatter plot
    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 10)
        .attr("fill", "gray");

    // The text on top of the scatter plot points
    var textGroup = chartGroup.append("g")
        .selectAll("text")
        .data(healthData)
        .enter()
        .append("text")
        .text(function(d){
            return d.abbr;
        })
        .attr("x",function(d){
            return xLinearScale(d[chosenXAxis]);
        })
        .attr("y",function(d){
            return yLinearScale(d[chosenYAxis])
        })
        .attr("dx","-.5em")
        .attr("dy",".25em")
        .attr("font-size","8px")
        .attr("fill","black");

        // Created the label group for the x axis
        var xLabelsGroup = chartGroup.append("g")
            .attr("transform",`translate(${width/2}, ${height + 15})`)
        
        // Creates the titles for the x-axis.
        var povertyLabel = xLabelsGroup.append("text")
            .attr("x",0)
            .attr("y",40)
            .attr("value", "poverty")
            .classed("inactive",true)
            .text("Poverty");

        var ageLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y",20)
            .attr("value","age")
            .classed("active", true)
            .text("Age");

        // Creates the label group for the y axis
        var yLabelsGroup = chartGroup.append("g")
            .attr("transform","rotate(-90)")

        // Creates the titles for the y-axis.
        var smokingLabel = yLabelsGroup.append("text")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "4em")
            .attr("value", "smokes")
            .classed("active", true)
            .text("Smoking");

        var obesityLabel = yLabelsGroup.append("text")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("value","obesity")
            .classed("inactive", true)
            .text("Obesity");

        // Event listeners for the x-axis.
        xLabelsGroup.selectAll("text")
         .on("click",function(){
             
            var value = d3.select(this).attr("value");
            
             if (value !== chosenXAxis){
                 chosenXAxis = value;

                 xLinearScale = xScale(healthData, chosenXAxis);

                 xAxis = renderXAxes(xLinearScale,xAxis);

                 circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenXAxis);

                 textGroup = renderTextX(textGroup, newXScale, chosenXAxis);
             };
            
         });
        
        // Event listeners for the y-axis.
        yLabelsGroup.selectAll("text")
         .on("click",function(){

            var value = d3.select(this).attr("value");
            
            console.log(value);

             if (value !== chosenYAxis){
                 chosenYAxis = value;
                 
                 yLinearScale = yScale(healthData, chosenYAxis);

                 yAxis = renderYAxes(yLinearScale, yAxis);

                 circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);
                 
             };

         });
});