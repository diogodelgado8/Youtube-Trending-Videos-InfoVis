class CirclePacking {
  margin = { top: 0, right: 0, bottom: 0, left: 0 }


  constructor(svg, data, width = 600, height = 700) {
    this.svg = svg;
    this.data = data
    this.height = height - this.margin.top - this.margin.bottom;
    this.width = width - this.margin.left - this.margin.right;;

  }

  initialize(scatter, clockHeatMap) {
    this.filteredData = this.data;
    this.scatter = scatter
    this.clockHeatMap = clockHeatMap;
    this.svg = d3.select(this.svg);
    this.container = this.svg.append("g");
    this.legend = this.svg.append("g");
    this.title_categoty = null;
    this.title_chanels = null;
    this.svg
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
    this.selected = null;
    this.container.append("text")
      .attr("x", (this.width / 2))
      .attr("y", 50 - (this.margin.top / 2))
      .attr('pointer-events', 'none')
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .attr("class", "shadow")
      //.style("text-decoration", "underline")  
      .text("Number of Total Views per Category per Channel");


  }

  update( /* * /, xVar/**/) {

    var channel_data = this.filteredData;
    var threshold=[0, 1, 5, 10, 20, 30, 100, 200, 300]
    var color = d3.scaleThreshold()
    .domain([0.1, 5, 10, 20, 30, 100, 200, 300])
    .range(["white","#f9ecf9", "#ecc6ec", "#df9fdf", "#d279d2", "#c653c6", "#ac39ac", "#862d86", "#602060"]); //"#391339" "#130613" 
    this.groups = d3.group(channel_data.filter((d) => d.chan_number_trending_videos != 0), d => d.chan_category)

    this.root = d3.hierarchy(this.groups);
  
    this.root.sum((d) => d.chan_video_views);
    const partition = d3.pack().size([600, 700]).padding(2);
    partition(this.root);




    this.nodes = this.container
      .selectAll("circle.node")
      .data(this.root.descendants().filter((d) => d.parent))
      .join("circle")
      ;

    this.nodes
      .attr("class", "packingValue itemValue")
      .classed("node", true)
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => d.r)
      .attr("fill", this.function=(d)=> {
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
      .attr("opacity", 1)
      .on("mouseover", (event, d) => this.handleMouseOverPacking(d))
      .on("mouseleave", (event, d) => this.handleMouseLeavePacking(d))
      .on("click", (event, d) => this.handleMouseClickPacking(d))
      ;
    
      if(this.title_chanels!=null){
       this.title_chanels.remove(); 
      }
      if(this.title_categoty!=null){
        this.title_categoty.remove();   
       }
    this.title_chanels = this.nodes.filter((d) => d.children == undefined)
      .append("title");
    this.title_chanels.text((d) => "Channel: " + d.data.channelTitle + "\nViews: " + d.data.chan_video_views + "\nSubs: " + d.data.chan_subscribers + "\nTrending videos: " + d.data.chan_number_trending_videos + "\nChannel videos: " + d.data.chan_video_count + "\nStarted date: " + d.data.chan_started);
    
    this.title_categoty = this.nodes.filter((d) => d.children != undefined && d.parent != null)
    .append("title");
    this.title_categoty.text((d) => "Categoty: " + d.data[0] + "\nNº Channels: " + d.children.length );
    console.log(this.svg)
    /***/ 
    


    this.labelnodes = this.container
      .selectAll('g')
      .data(this.root.descendants())
      .join('g')
      .attr('transform', function (d) { return 'translate(' + [d.x, d.y] + ')' }).raise();

    /* some lable dunno what* /
        this.labelnodes
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
    /* */
    this.labelnodes
      .append('text')
      .attr("fill","black")
      .attr("class", "packingValueLabel label")
      .attr('pointer-events', 'none')
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .attr("stroke", "black")
      .attr("stroke-width", ".1px")
      .attr("font-weight","900")
      .attr('dy', 4)
      .text(function (d) {
        return (d.children != undefined && d.parent != null) ? d.data[0] : '';
      })
    /***/
 
  }

  isSelected(item, isDebug = false, whoAsked = "") {
    if (this.selected !== null) {
      if (this.selected.children != undefined && item.children != undefined) {
        if (item.data[0] == this.selected.data[0]) {
          if(isDebug){
            console.log("im a selected category: asked by:", whoAsked);
            console.log(item);
          }
          
          return true;
        }
      }
      else if (this.selected.children == undefined && item.children == undefined) {
        if (item.data.channelTitle == this.selected.data.channelTitle) {
          if(isDebug){
            console.log("im a selected chanel: asked by:", whoAsked);
            console.log(item);
          }
          return true;
        }
      }

    }
    return false;
  }
  
  handleMouseOverPacking(item) {
    this.nodes
      .filter(this.function = (d) => {
        if(this.isSelected(item)){
          return false;
        }
        if (item.children != undefined) {
          return (d.children != undefined && d.parent != null) && (d.data[0] == item.data[0] || d.data[0] == item.data.chan_category)
        }
        else {
          if (d.parent != null) {
            return d.data.channelTitle == item.data.channelTitle
          }

        }

      }

      )
      .style("fill", "#006666")
      .style("opacity", 1)
      ;
  }

  handleMouseLeavePacking(item) {

    var color = d3.scaleThreshold()
    .domain([0.1, 5, 10, 20, 30, 100, 200, 300])
    .range(["white","#f9ecf9", "#ecc6ec", "#df9fdf", "#d279d2", "#c653c6", "#ac39ac", "#862d86", "#602060"]); //"#391339" "#130613" 

    this.nodes.filter(this.function = (d) => !this.isSelected(d))
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
      .style("opacity", 1)
      ;


  }


  handleMouseClickPacking(item) {

    var color = d3.scaleThreshold()
    .domain([0.1, 5, 10, 20, 30, 100, 200, 300])
    .range(["white","#f9ecf9", "#ecc6ec", "#df9fdf", "#d279d2", "#c653c6", "#ac39ac", "#862d86", "#602060"]); //"#391339" "#130613" 

    this.nodes
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
      .style("opacity", 1)
      ;

    console.log(this);
    if (this.selected != item) { 
      this.selected = item;
      var filteredData = this.scatter.data
        .filter(this.function = (d) => {

          if (item.children == undefined) {
            return d.channelTitle == item.data.channelTitle;
          }
          if (item.children != undefined && item.parent != null) {
            return d.chan_category == item.data[0];
          }
        });
      this.scatter.filteredData_circle = filteredData;
      this.clockHeatMap.filteredData = filteredData;

    }
    else {
      this.selected = null;
      this.scatter.filteredData_circle = this.scatter.data
      this.clockHeatMap.filteredData = this.clockHeatMap.data;
    }
    this.nodes.filter(this.function = (d) => d==item && !this.isSelected(d)).style("fill", "#006666")
    .style("opacity", 1)
    ;
    this.nodes.filter(this.function = (d) => this.isSelected(d)).style("fill", "red")
    .style("opacity", 1)
    ;
    this.scatter.update()
    this.clockHeatMap.update();
    console.log(item)




  }

}