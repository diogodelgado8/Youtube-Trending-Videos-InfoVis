
function createCircularPacking(data, id, selection, data_vids) {
  margin = { top: -250, right: 0, bottom: 0, left: -80 };
  width = 600 - margin.left - margin.right;
  height = 700 - margin.top - margin.bottom;

  svg = d3
    .select(id)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  var color = d3.scaleThreshold()
    .domain([0, 10, 20, 30, 100, 200, 300, 400])
    .range(["#fcfbfd", "#f0eef6", "#dedded", "#c7c6e0", "#aaaad0", "#796eb2", "#64499f", "#52228c", "#3e007c"]);



  groups = d3.group(data, d => d.chan_category)
  let root = d3.hierarchy(groups);


  root.sum((d) => d.chan_video_views);

  const partition = d3.pack().size([600, 1200]).padding(0);

  partition(root);
  //console.log(root.descendants().filter((d)=> d.parent))
  svg
    .selectAll("circle.node")
    .data(root.descendants())
    .enter().filter((d) => d.parent)
    .append("circle")
    .attr("class", "packingValue itemValue")
    .classed("node", true)
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", (d) => d.r)
    .attr("fill", function (d) {
      if (d.children == undefined) {
        return color(d.data.chan_number_trending_videos);
      }
      if (d.children != undefined && d.parent != null) {
        var sum = 0;
        //console.log("===========================")
        for (let a of d.children) {
          sum = sum + (+a.data.chan_number_trending_videos);
        }
        //console.log(d.data[0]," num vids: ",sum);
        return color(sum);
      }
    })
    .attr("stroke", "black")
    .attr("opacity", 0.5)
    .on("mouseover", (event, d) => handleMouseOverPacking(d, selection))
    .on("mouseleave", (event, d) => handleMouseLeavePacking(d, selection))
    .on("click", (event, d) => handleMouseClickPacking(d, selection, data_vids))
    ;
  /***/
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 150 - (margin.top / 2))
    .attr('pointer-events', 'none')
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .attr("class", "shadow")
    //.style("text-decoration", "underline")  
    .text("Number of Total Views per Category per Channel");


  var nodes = d3.select('svg g')
    .selectAll('g')
    .data(root.descendants())
    .join('g')
    .attr('transform', function (d) { return 'translate(' + [d.x, d.y] + ')' })

  nodes
    .append('text')
    .attr('pointer-events', 'none')
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    //.attr("font-weight","900")
    .attr("class", "shadow")
    .attr('dy', 4)
    .text(function (d) {
      return (d.children != undefined && d.parent != null) ? d.data[0] : '';
    })

  nodes
    .append('text')
    .attr('pointer-events', 'none')
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    //.attr("font-weight","900")
    .attr('dy', 4)
    .text(function (d) {
      return (d.children != undefined && d.parent != null) ? d.data[0] : '';
    })
  /***/
}

function handleMouseOverPacking(item, selection) {
  d3.selectAll(".packingValue")
    .filter((d) =>
      (d.children != undefined && d.parent != null) && (d.data[0] == item.data[0] || d.data[0] == item.data.chan_category)
    )
    .style("fill", "red")
    .style("opacity", 1)
    ;

  d3.selectAll(".circleValue")
    .filter((d) =>
      d.title == item.Channeltitle
    )
    .attr("r", 4)
    .style("fill", "#006666")
    .style("opacity", 1)
    ;
}

function handleMouseLeavePacking(item, selection) {
  var color = d3.scaleThreshold()
    .domain([0, 10, 20, 30, 100, 200, 300, 400])
    .range(["#fcfbfd", "#f0eef6", "#dedded", "#c7c6e0", "#aaaad0", "#796eb2", "#64499f", "#52228c", "#3e007c"]);


  d3.selectAll(".packingValue")
    .style("fill", function (d) {
      if (d.children == undefined) {
        return color(d.data.chan_number_trending_videos);
      }
      if (d.children != undefined && d.parent != null) {
        var sum = 0;
        for (let a of d.children) {
          sum = sum + (+a.data.chan_number_trending_videos);
        }
        //console.log(color(sum))
        return color(sum);
      }
    })
    .style("stroke", "black")
    .style("opacity", 0.5)
    ;


}


function handleMouseClickPacking(item) {
  filter_data = d3.selectAll(".circleValue")
  console.log(filter_data)

  filter_data = filter_data.filter(function (d) {
      if (item.children == undefined) {
        return d.chan_category == item.data.chan_category;
      }
      if (item.children != undefined && item.parent != null) {

        return d.chan_category == item.data[0];
      }
    });
  console.log(filter_data)
  //updateChartScatter()
  console.log(item)




}


