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

// The initial values for both x and y.
var chosenXAxis = "age";
var chosenYAxis = "smokes";

// Creates the x scale based on the x values given
function xScale(healthData, chosenXAxis){
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.95 ,d3.max(healthData, d => d[chosenXAxis]) * 1.05])
        .range([0,width]);
        
        return xLinearScale
};

// Creates the y scale based on the y values given
function yScale(healthData, chosenYAxis){
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.9, d3.max(healthData, d => d[chosenYAxis]) * 1.1])
        .range([height,0]);
        
        return yLinearScale
};

// Changes the x axis based on the x values.
function renderXAxes(newXScale, xAxis){
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

    return xAxis;
};

// Changes the y axis based on the y values.
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

// Changes the text and moves it on the x-axis.
function renderTextX(textGroup, newXScale, chosenXAxis){
    textGroup.transition()
     .duration(1000)
     .attr("x",function(d){
        return newXScale(d[chosenXAxis]);
     });
    
    return textGroup;
};

// Changes the text and moves it on the y-axis.
function renderTextY(textGroup, newYScale, chosenYAxis){
    textGroup.transition()
     .duration(1000)
     .attr("y",function(d){
        return newYScale(d[chosenYAxis]);
     });
    
    return textGroup;
};

// Creates a tool tip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    // The labels for the x axis and the y axis respectively
    var xlabel;
    var ylabel;
  
    // Changes the label for the x, based on the selection
    if (chosenXAxis === "age") {
      xlabel = "Age:";
    }
    else if(chosenXAxis === "obesity"){
      xlabel = "Obesity:";
    }
    else {
      xlabel = "Poverty:";
    }

    // Changes the label for the y, based on the selection
    if (chosenYAxis === "smokes") {
        ylabel = "Smoking:";
      }
      else if(chosenYAxis === "healthcare"){
        ylabel = "Healthcare:";
      }
      else {
        ylabel = "Income:";
      }
  
    //   The format of the tooltip, with the help of css styles
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-6,3])
      .html(function(d) {
        return (`${d.abbr}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
      });
  
    circlesGroup.call(toolTip);
      
    // Shows and hides the tool tip on the mouseover event.
    circlesGroup.on("mouseover", toolTip.show)
      // onmouseout event
      .on("mouseout", toolTip.hide);
  
    //   Returns the circles group
    return circlesGroup;
  };

// Reading the csv file
d3.csv("assets/data/data.csv").then(function(healthData){
    
    // Setting the data to be numbers instead of a string
    healthData.forEach(function(data){
        data.age = +data.age;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
        data.poverty = +data.poverty;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
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
        .attr("fill", "gray")
        .attr("stroke", "black");

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
            .attr("y",60)
            .attr("value", "poverty")
            .classed("inactive",true)
            .text("Poverty");

        var obesityLabel = xLabelsGroup.append("text")
            .attr("x", 0)
            .attr("y",40)
            .attr("value","obesity")
            .classed("inactive", true)
            .text("Obesity");

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
            .attr("dy", "3em")
            .attr("value", "smokes")
            .classed("active", true)
            .text("Smoking");

        var healthcareLabel = yLabelsGroup.append("text")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "2em")
            .attr("value","healthcare")
            .classed("inactive", true)
            .text("Healthcare");

        var incomeLabel = yLabelsGroup.append("text")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("value","income")
            .classed("inactive", true)
            .text("Income");


        var circlesGroup = updateToolTip(chosenXAxis,chosenYAxis,circlesGroup);
        // Event listeners for the x-axis.
        xLabelsGroup.selectAll("text")
         .on("click",function(){
             
            var value = d3.select(this).attr("value");
            // Looks for any change.
             if (value !== chosenXAxis){
                
                // Sets the new value
                chosenXAxis = value;

                // Creates a new x scale
                 xLinearScale = xScale(healthData, chosenXAxis);

                //  Creates a new axis
                 xAxis = renderXAxes(xLinearScale,xAxis);

                //  Relocates the circles on the x axis of the scatterplot
                 circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenXAxis);

                //  Updates the tooltip on the x values.
                 circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup)

                //  relocates the text on the x axis.
                 textGroup = renderTextX(textGroup, xLinearScale, chosenXAxis);
                
                //  Changes the active status depending on the label selection
                if (chosenXAxis == "obesity"){
                    ageLabel
                     .classed("active", false)
                     .classed("inactive", true)
                    obesityLabel
                     .classed("active", true)
                     .classed("inactive", false)
                    povertyLabel
                     .classed("active", false)
                     .classed("inactive", true)
                     
                } else if (chosenXAxis == "poverty"){
                    ageLabel
                     .classed("active", false)
                     .classed("inactive", true)
                    obesityLabel
                     .classed("active", false)
                     .classed("inactive", true)
                    povertyLabel
                     .classed("active", true)
                     .classed("inactive", false)
                
                } else{
                    ageLabel
                     .classed("active", true)
                     .classed("inactive", false)
                    obesityLabel
                     .classed("active", false)
                     .classed("inactive", true)
                    povertyLabel
                     .classed("active", false)
                     .classed("inactive", true)
                };
             };
            
         });
        
        // Event listeners for the y-axis.
        yLabelsGroup.selectAll("text")
         .on("click",function(){
            // Pulls the value of the selected label
            var value = d3.select(this).attr("value");

            // Checks for any changes in the y labels
             if (value !== chosenYAxis){
                
                //  Sets the new value
                 chosenYAxis = value;
                
                //  Creates the new y scale
                 yLinearScale = yScale(healthData, chosenYAxis);

                //  sets the new y axis
                 yAxis = renderYAxes(yLinearScale, yAxis);

                //  Relocates the points based on their new y value
                 circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);
                 
                //  Updates the tool tip based on the y axis value.
                 circlesGroup = updateToolTip(chosenXAxis,chosenYAxis,circlesGroup)

                // Relocates the text based on their new y value
                 textGroup = renderTextY(textGroup, yLinearScale, chosenYAxis);
                
                //  Sets the active status of the labels based on the label selection
                if (chosenYAxis == "healthcare"){
                    smokingLabel
                     .classed("active", false)
                     .classed("inactive", true)
                    healthcareLabel
                     .classed("active", true)
                     .classed("inactive", false)
                    incomeLabel
                     .classed("active", false)
                     .classed("inactive", true)
                     
                } else if (chosenYAxis == "income"){
                    smokingLabel
                     .classed("active", false)
                     .classed("inactive", true)
                    healthcareLabel
                     .classed("active", false)
                     .classed("inactive", true)
                    incomeLabel
                     .classed("active", true)
                     .classed("inactive", false)
                
                } else{
                    smokingLabel
                     .classed("active", true)
                     .classed("inactive", false)
                    healthcareLabel
                     .classed("active", false)
                     .classed("inactive", true)
                    incomeLabel
                     .classed("active", false)
                     .classed("inactive", true)
                };
             };

         });
}).catch(function(error) {
    console.log(error);
  });