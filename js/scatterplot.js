function createScatterPlot(data, id) {

  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  const width = 600 - margin.left - margin.right;
  const height = 420 - margin.top - margin.bottom;



  const svg = d3
    .select(id)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("id", "gScatterPlot")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  var color = d3.scaleThreshold()
    .domain([20000000, 40000000, 60000000, 80000000])
    .range(["#ffb3b3", "#ff6666", "#ff1a1a", "#cc0000", "#800000"]);


  var x = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +d.view_count) * 1.05])
    .range([0, width]);
  var xAxis = svg
    .append("g")
    .attr("id", "gXAxis")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickFormat((x) => x / 1000000 + "M"));
  svg
    .append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 35)
    .text("Views");

  var y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +d.likes) * 1.05])
    .range([height, 0]);
  var yAxis = svg
    .append("g")
    .attr("id", "gYAxis")
    .call(d3.axisLeft(y).tickFormat((y) => y / 1000000 + "M"));
  svg
    .append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", "-1em")
    .attr("transform", "rotate(0)")
    .text("Likes");

  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    //.style("text-decoration", "underline")  
    .text("Like-to-View Ratio of Trending Videos");

  // Add a clipPath: everything out of this area won't be drawn.
  const clip = svg.append("defs").append("SVG:clipPath")
    .attr("id", "clip")
    .append("SVG:rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0);

  // Create the scatter variable: where both the circles and the brush take place
  const scatter = svg.append('g')
    .attr("clip-path", "url(#clip)")

  // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
  var zoom = d3
    .zoom()
    .scaleExtent([1, 20])  // This control how much you can unzoom (x0.5) and zoom (x50)
    .translateExtent([[0, 0], [width + 1, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", (e) => updateChartScatter(e, x, y, xAxis, yAxis, scatter, data, color));

  var textX = d3.extent(x.domain())[1];
  var textY = d3.extent(y.domain())[1];
  scatter
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all")
    .call(zoom);

  scatter.append('line')
    .attr("class", "lines l1")
    .style("stroke", "black")
    .style("stroke-width", 0.5)
    .attr("x1", x(0))
    .attr("y1", y(0))
    .attr("x2", x(d3.max(data, (d) => +d.view_count)))
    .attr("y2", y((d3.max(data, (d) => +d.view_count)) * 0.025));

  console.log("old x value: ", x(d3.max(data, (d) => +d.view_count)));
  console.log("new x value: ", x(textX));

  scatter.append("text")
    .attr("y", function () { return y((d3.max(data, (d) => +d.view_count)) * 0.025) })//magic number here
    .attr("x", function () { return x(d3.max(data, (d) => +d.view_count)) })
    .attr('text-anchor', 'middle')
    .attr("class", "texts tl1")
    .text("2.5%");

  scatter.append('line')
    .attr("class", "lines l2")
    .style("stroke", "black")
    .style("stroke-width", 0.5)
    .attr("x1", x(0))
    .attr("y1", y(0))
    .attr("x2", x(d3.max(data, (d) => +d.view_count)))
    .attr("y2", y((d3.max(data, (d) => +d.view_count)) * 0.05))
    .text((d) => "5%");

  scatter.append("text")
    .attr("y", function () { return y((d3.max(data, (d) => +d.view_count)) * 0.05) })//magic number here
    .attr("x", function () { return x(d3.max(data, (d) => +d.view_count)) })
    .attr('text-anchor', 'middle')
    .attr("class", "texts tl2")
    .text("5%");

  scatter.append('line')
    .attr("class", "lines l3")
    .style("stroke", "black")
    .style("stroke-width", 0.5)
    .attr("x1", x(0))
    .attr("y1", y(0))
    .attr("x2", x(d3.max(data, (d) => +d.view_count)))
    .attr("y2", y((d3.max(data, (d) => +d.view_count)) * 0.1))
    .text((d) => "10%");

  scatter.append("text")
    .attr("y", function () { return y((d3.max(data, (d) => +d.view_count) / 1.4) * 0.1) })//magic number here
    .attr("x", function () { return x(d3.max(data, (d) => +d.view_count) / 1.4) })
    .attr('text-anchor', 'middle')
    .attr("class", "texts tl3")
    .text("10%");

  scatter.append('line')
    .attr("class", "lines l4")
    .style("stroke", "black")
    .style("stroke-width", 0.5)
    .attr("x1", x(0))
    .attr("y1", y(0))
    .attr("x2", x(d3.max(data, (d) => +d.view_count)))
    .attr("y2", y((d3.max(data, (d) => +d.view_count)) * 0.2))
    .text((d) => "20%");

  scatter.append("text")
    .attr("y", function () { return y((d3.max(data, (d) => +d.view_count) / 2.8) * 0.2) })//magic number here
    .attr("x", function () { return x(d3.max(data, (d) => +d.view_count) / 2.8) })
    .attr('text-anchor', 'middle')
    .attr("class", "texts tl4")
    .text("20%");

  console.log("maxy: ", d3.extent(y.domain())[1])
  //scatter
  scatter
    .selectAll("circle.circleValue")
    .data(data, (d) => d.title)
    .join("circle")
    .attr("class", "circleValue itemValue")
    .attr("cx", (d) => x(d.view_count))
    .attr("cy", (d) => y(d.likes))
    .attr("r", 3)
    .style("fill", function (d) { return color(d.chan_subscribers) })
    .style("opacity", 0.5)
    .on("mouseover", (event, d) => handleMouseOverScatter(d))
    .on("mouseleave", (event, d) => handleMouseLeaveScatter(d))
    .append("title")
    .text((d) => "Title: " + d.title + "\nChannel: " + d.channelTitle);


};

// A function that updates the chart when the user zoom and thus new boundaries are available
function updateChartScatter(event, x, y, xAxis, yAxis, scatter, data, color) {

  // recover the new scale
  var newX = event.transform.rescaleX(x);
  var newY = event.transform.rescaleY(y);
  console.log("event", event)
  // update axes with these new boundaries
  xAxis.call(d3.axisBottom(newX).tickFormat((x) => x / 1000000 + "M"))
  yAxis.call(d3.axisLeft(newY).tickFormat((x) => x / 1000000 + "M"))
  /** /
    scatter
    .selectAll("circle.circleValues") 
    .data(data, (d) => d.title) 
    .join("circle")
    .attr("class", "circleValue itemValue")
        .attr('cx', function(d) {return newX(d.view_count)})
        .attr('cy', function(d) {return newY(d.likes)})
        .attr("r", 3)
        .style("fill", function(d){ return color(d.chan_subscribers)})
      .style("opacity", 0.5)
      .on("mouseover", (event, d) => handleMouseOverScatter(d))
      .on("mouseleave", (event, d) => handleMouseLeaveScatter(d))
      .append("title")
      .text((d) => "Title: " + d.title +"\nChannel: "+ d.channelTitle );
      /**/
  /**/
  var textX = d3.extent(newX.domain())[1];
  var textY = d3.extent(newY.domain())[1];

  scatter
    .selectAll("circle.circleValue")
    .data(data, (d) => d.title)
    .join("circle")
    .attr("class", "circleValue itemValue")
    .attr('cx', function (d) { return newX(d.view_count) })
    .attr('cy', function (d) { return newY(d.likes) })
    .attr("r", 3)
    .style("fill", function (d) { return color(d.chan_subscribers) })
    .style("opacity", 0.5)
    .on("mouseover", (event, d) => handleMouseOverScatter(d))
    .on("mouseleave", (event, d) => handleMouseLeaveScatter(d))
    .append("title")
    .text((d) => "Title: " + d.title + "\nChannel: " + d.channelTitle);
  /**/

  scatter
    .select(".l1")
    .attr("class", "lines l1")
    .style("stroke", "black")
    .style("stroke-width", 0.5)
    .attr("x1", newX(0))
    .attr("y1", newY(0))
    .attr("x2", newX(d3.max(data, (d) => +d.view_count)))
    .attr("y2", newY((d3.max(data, (d) => +d.view_count)) * 0.025))
    .text((d) => "2.5%");

  scatter.select(".tl1")
    .attr("y", function () { return newY((d3.max(data, (d) => +d.view_count)) * 0.025) })//magic number here
    .attr("x", function () { return newX(d3.max(data, (d) => +d.view_count)) })
    .attr('text-anchor', 'middle')
    .attr("class", "texts tl1")
    .text("2.5%");

  scatter
    .select(".l2")
    .attr("class", "lines l2")
    .style("stroke", "black")
    .style("stroke-width", 0.5)
    .attr("x1", newX(0))
    .attr("y1", newY(0))
    .attr("x2", newX(d3.max(data, (d) => +d.view_count)))
    .attr("y2", newY((d3.max(data, (d) => +d.view_count)) * 0.05))
    .text((d) => "5%");

  scatter.select(".tl2")
    .attr("y", function () { return newY((d3.max(data, (d) => +d.view_count)) * 0.05) })//magic number here
    .attr("x", function () { return newX(d3.max(data, (d) => +d.view_count)) })
    .attr('text-anchor', 'middle')
    .attr("class", "texts tl2")
    .text("5%");

  scatter
    .select(".l3")
    .attr("class", "lines l3")
    .style("stroke", "black")
    .style("stroke-width", 0.5)
    .attr("x1", newX(0))
    .attr("y1", newY(0))
    .attr("x2", newX(d3.max(data, (d) => +d.view_count)))
    .attr("y2", newY((d3.max(data, (d) => +d.view_count)) * 0.1))
    .text((d) => "10%");

  scatter.select(".tl3")
    .attr("y", function () { return newY((d3.max(data, (d) => +d.view_count) / 1.4) * 0.1) })//magic number here
    .attr("x", function () { return newX(d3.max(data, (d) => +d.view_count) / 1.4) })
    .attr('text-anchor', 'middle')
    .attr("class", "texts tl3")
    .text("10%");
  scatter
    .select(".l4")
    .attr("class", "lines l4")
    .style("stroke", "black")
    .style("stroke-width", 0.5)
    .attr("x1", newX(0))
    .attr("y1", newY(0))
    .attr("x2", newX(d3.max(data, (d) => +d.view_count)))
    .attr("y2", newY((d3.max(data, (d) => +d.view_count)) * 0.2))
    .text((d) => "20%");

  scatter.select(".tl4")
    .attr("y", function () { return newY((d3.max(data, (d) => +d.view_count) / 2.8) * 0.2) })//magic number here
    .attr("x", function () { return newX(d3.max(data, (d) => +d.view_count) / 2.8) })
    .attr('text-anchor', 'middle')
    .attr("class", "texts tl4")
    .text("20%");
}





function handleMouseOverScatter(item) {


  d3.selectAll(".circleValue")
    .filter((d) =>
      d.title == item.title
    )
    .attr("r", 4)
    .style("fill", "#006666")
    .style("opacity", 1)
    ;

  d3.selectAll(".packingValue")
    .filter((d) =>
      (d.children != undefined && d.parent != null)
    )
    .filter((d) => (d.data[0] == item.chan_category))
    .style("fill", "DeepPink")
    .style("opacity", 1)
    ;

  d3.selectAll(".packingValue")
    .filter((d) =>
      (d.children == undefined)
    )
    .filter((d) => (d.data.channelTitle == item.channelTitle))
    .style("fill", "red")
    .style("opacity", 1)
    ;


}

function handleMouseLeaveScatter(d) {
  var color = d3.scaleThreshold()
    .domain([20000000, 40000000, 60000000, 80000000])
    .range(["#ffb3b3", "#ff6666", "#ff1a1a", "#cc0000", "#800000"]);

  d3.selectAll(".circleValue")
    .attr("r", 3)
    .style("fill", function (d) { return color(d.chan_subscribers) })
    .style("opacity", 0.5)
    ;

  var color2 = d3.scaleThreshold()
    .domain([0, 10, 20, 30, 100, 200, 300, 400])
    .range(["#fcfbfd", "#f0eef6", "#dedded", "#c7c6e0", "#aaaad0", "#796eb2", "#64499f", "#52228c", "#3e007c"]);

  d3.selectAll(".packingValue")
    .style("fill", function (d) {
      if (d.children == undefined) {
        return color2(d.data.chan_number_trending_videos);
      }
      if (d.children != undefined && d.parent != null) {
        var sum = 0;
        for (let a of d.children) {
          sum = sum + (+a.data.chan_number_trending_videos);
        }
        return color2(sum);
      }
    })
    .style("stroke", "blacks")
    .style("opacity", 0.5)
    ;

}


