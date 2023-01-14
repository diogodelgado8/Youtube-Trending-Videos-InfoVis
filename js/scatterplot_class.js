class ScatterPlot {
    margin = { top: 100, right: 50, bottom: 50, left: 40 };



    constructor(svg, data, width = 570, height = 470) {
        this.svg = svg;
        this.data = data;
        this.addedHeight = 700 - height;
        this.height = height - this.margin.top - this.margin.bottom;
        this.width = width - this.margin.left - this.margin.right;;
        this.idleTimeout = 1;
    }

    initialize(circlePack, clockHeatMap) {
        this.circlePack = circlePack;
        this.clockHeatMap = clockHeatMap;
        this.filteredData_clock = this.data;
        this.filteredData_circle = this.data;
        this.svg = d3.select(this.svg);
        this.container = this.svg.append("g");
        this.container.append("text")
            .attr("x", (this.width / 2))
            .attr("y", 0 - (this.margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            //.style("text-decoration", "underline")  
            .text("Like-to-View Ratio of Trending Videos");
        this.legend = this.svg.append("g");
        this.xAxis = this.container.append("g");
        this.yAxis = this.container.append("g");
        this.xAxisLabel = this.container.append("g");
        this.yAxisLabel = this.container.append("g");
        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom + this.addedHeight);
        this.color = d3.scaleThreshold()
            .domain([20000000, 40000000, 60000000, 80000000])
            .range(["#ffb3b3", "#ff6666", "#ff1a1a", "#cc0000", "#800000"]);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);
        this.clip = this.container.append("defs").append("SVG:clipPath")
            .attr("id", "clip")
            .append("SVG:rect")
            .attr("width", this.width)
            .attr("height", this.height)
            .attr("x", 0)
            .attr("y", 0);

        this.scatter = this.container.append('g')
            .attr("clip-path", "url(#clip)")

        this.x = d3
            .scaleLinear()
            .domain([0, d3.max(this.data, (d) => +d.view_count) * 1.05])
            .range([0, this.width]);



        this.xAxis.attr("id", "gXAxis")
            .attr("transform", `translate(0, ${this.height})`)
            .call(d3.axisBottom(this.x).tickFormat((x) => x / 1000000 + "M"));

        this.xAxisLabel.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", this.width)
            .attr("y", this.height + 35)
            .text("Views");

        this.y = d3
            .scaleLinear()
            .domain([0, d3.max(this.data, (d) => +d.likes) * 1.05])
            .range([this.height, 0]);

        this.yAxis.attr("id", "gYAxis")
            .call(d3.axisLeft(this.y).tickFormat((y) => y / 1000000 + "M"));

        this.yAxisLabel.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 6)
            .attr("dy", "-1em")
            .attr("transform", "rotate(0)")
            .text("Likes");

        this.scatter.append('line')
            .attr("class", "lines l1")
            .style("stroke", "black")
            .style("stroke-width", 0.5)
            .attr("x1", this.x(0))
            .attr("y1", this.y(0))
            .attr("x2", this.x(d3.max(this.data, (d) => +d.view_count)))
            .attr("y2", this.y((d3.max(this.data, (d) => +d.view_count)) * 0.025));

        this.scatter.append("text")
            .attr("y", this.function = () => { return this.y((d3.max(this.data, (d) => +d.view_count)) * 0.025) })//magic number here
            .attr("x", this.function = () => { return this.x(d3.max(this.data, (d) => +d.view_count)) })
            .attr('text-anchor', 'middle')
            .attr("class", "texts tl1")
            .text("2.5%");

        this.scatter.append('line')
            .attr("class", "lines l2")
            .style("stroke", "black")
            .style("stroke-width", 0.5)
            .attr("y1", this.y(0))
            .attr("x1", this.x(0))
            .attr("x2", this.x(d3.max(this.data, (d) => +d.view_count)))
            .attr("y2", this.y((d3.max(this.data, (d) => +d.view_count)) * 0.05))
            .text((d) => "5%");

        this.scatter.append("text")
            .attr("y", this.function = () => { return this.y((d3.max(this.data, (d) => +d.view_count)) * 0.05) })//magic number here
            .attr("x", this.function = () => { return this.x(d3.max(this.data, (d) => +d.view_count)) })
            .attr('text-anchor', 'middle')
            .attr("class", "texts tl2")
            .text("5%");

        this.scatter.append('line')
            .attr("class", "lines l3")
            .style("stroke", "black")
            .style("stroke-width", 0.5)
            .attr("x1", this.x(0))
            .attr("y1", this.y(0))
            .attr("x2", this.x(d3.max(this.data, (d) => +d.view_count)))
            .attr("y2", this.y((d3.max(this.data, (d) => +d.view_count)) * 0.1))
            .text((d) => "10%");

        this.scatter.append("text")
            .attr("y", this.function = () => { return this.y((d3.max(this.data, (d) => + d.view_count) / 1.4) * 0.1) })//magic number here
            .attr("x", this.function = () => { return this.x(d3.max(this.data, (d) => + d.view_count) / 1.4) })
            .attr('text-anchor', 'middle')
            .attr("class", "texts tl3")
            .text("10%");

        this.scatter.append('line')
            .attr("class", "lines l4")
            .style("stroke", "black")
            .style("stroke-width", 0.5)
            .attr("x1", this.x(0))
            .attr("y1", this.y(0))
            .attr("x2", this.x(d3.max(this.data, (d) => +d.view_count)))
            .attr("y2", this.y((d3.max(this.data, (d) => +d.view_count)) * 0.2))
            .text((d) => "20%");

        this.scatter.append("text")
            .attr("y", this.function = () => { return this.y((d3.max(this.data, (d) => +d.view_count) / 2.8) * 0.2) })//magic number here
            .attr("x", this.function = () => { return this.x(d3.max(this.data, (d) => +d.view_count) / 2.8) })
            .attr('text-anchor', 'middle')
            .attr("class", "texts tl4")
            .text("20%");
        /**/

        // Add brushing
        this.brush = d3.brush()                 // Add the brush feature using the d3.brush function
            .extent([[0, 0], [this.width, this.height]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("end", (event) => this.update(event)) // Each time the brush selection changes, trigger the 'updateChart' function

        /*
    this.zoom = d3.zoom()
        .scaleExtent([1, 20])  // This control how much you can unzoom (x0.5) and zoom (x50)
        .translateExtent([[0, 0], [this.width + 1, this.height]])
        .extent([[0, 0], [this.width, this.height]])
        .on("zoom", (event) => this.update(event));
    this.scatter
        .append("rect")
        .attr("width", this.width)
        .attr("height", this.height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .call(this.zoom);
        */

        // Add the brushing
        this.scatter
            .append("g")
            .attr("class", "brush")
            .call(this.brush);


        this.LegendContainer = this.svg.append("g")
        this.LegendContainer.attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`);
        var keys = ["0", "1-4", "5-9", "10-19", "20-29", "30-99", "100-199", "200-299", "300+"]

        // Usually you have a color scale in your chart already

        var colorL = d3.scaleOrdinal()
            .domain(keys)
            .range(["#fff", "#f9ecf9", "#ecc6ec", "#df9fdf", "#d279d2", "#c653c6", "#ac39ac", "#862d86", "#602060","#391339"]); //"#391339" "#130613" 


        
        // Add one dot in the legend for each name.
        var sizey = 20
        var sizex = this.width
        this.LegendContainer.selectAll("mydots")
            .data(keys)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", function (d, i) { return 65 + i * (sizey) }) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("width", sizex)
            .attr("height", sizey)
            .style("fill", function (d) { return colorL(d) })
            .style("stroke", "black")
            .style("stroke-width", 0.5)

        // Add one dot in the legend for each name.
        this.LegendContainer.selectAll("mylabels")
            .data(keys)
            .enter()
            .append("text")
            .attr("x", sizex / 2)
            .attr("y", function (d, i) { return 65 + i * (sizey) + (sizey / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", "black")
            .text(function (d) { return d })
            .attr("text-anchor", "middle")
            .style("alignment-baseline", "middle")

        this.LegendContainer.append("text")
            .attr("x", (this.width / 2))
            .attr("y", 59)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            //.style("text-decoration", "underline")  
            .text("Number of trending videos");
    }

    idled() { this.idleTimeout = null; }

    update({ selection } = {}) {

        let data = this.filteredData_circle.filter(value => this.filteredData_clock.includes(value));

        let newX = null;
        let newY = null;

        // recover the new scale
        this.x = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => +d.view_count) * 1.05])
            .range([0, this.width]);
        this.y = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => +d.likes) * 1.05])
            .range([this.height, 0]);

        if (selection) {


            const [[x0, y0], [x1, y1]] = selection;
            // recover the new scale
            newX = this.x.domain([this.x.invert(x0), this.x.invert(x1)])
            newY = this.y.domain([this.y.invert(y1), this.y.invert(y0)])
            this.scatter.select(".brush").call(this.brush.move, null) // This remove the grey brush area as soon as the selection has been done
        }
        else {

            if (!this.idleTimeout) return this.idleTimeout = setTimeout(this.idled, 350); // This allows to wait a little bit

            // recover the new scale
            newX = this.x;
            newY = this.y;
        }

        // update axes with these new boundaries
        this.xAxis.transition().duration(1000).call(d3.axisBottom(newX).tickFormat((x) => x / 1000000 + "M"))
        this.yAxis.transition().duration(1000).call(d3.axisLeft(newY).tickFormat((x) => x / 1000000 + "M"))

        // Add a clipPath: everything out of this area won't be drawn.


        // Create the scatter variable: where both the circles and the brush take place


        /**/
        this.scatter
            .select(".l1")
            .attr("class", "lines l1")
            .style("stroke", "black")
            .style("stroke-width", 0.5)
            .attr("x1", newX(0))
            .attr("y1", newY(0))
            .attr("x2", newX(d3.max(data, (d) => +d.view_count)))
            .attr("y2", newY((d3.max(data, (d) => +d.view_count)) * 0.025))
            .text((d) => "2.5%");

        this.scatter.select(".tl1")
            .attr("y", newY((d3.max(data, (d) => +d.view_count)) * 0.025))//magic number here
            .attr("x", newX(d3.max(data, (d) => +d.view_count)))
            .attr('text-anchor', 'middle')
            .attr("class", "texts tl1")
            .text("2.5%");

        this.scatter
            .select(".l2")
            .attr("class", "lines l2")
            .style("stroke", "black")
            .style("stroke-width", 0.5)
            .attr("x1", newX(0))
            .attr("y1", newY(0))
            .attr("x2", newX(d3.max(data, (d) => +d.view_count)))
            .attr("y2", newY((d3.max(data, (d) => +d.view_count)) * 0.05));

        this.scatter.select(".tl2")
            .attr("y", newY((d3.max(data, (d) => +d.view_count)) * 0.05))//magic number here
            .attr("x", newX(d3.max(data, (d) => +d.view_count)))
            .attr('text-anchor', 'middle')
            .attr("class", "texts tl2")
            .text("5%");

        this.scatter
            .select(".l3")
            .attr("class", "lines l3")
            .style("stroke", "black")
            .style("stroke-width", 0.5)
            .attr("x1", newX(0))
            .attr("y1", newY(0))
            .attr("x2", newX(d3.max(data, (d) => +d.view_count)))
            .attr("y2", newY((d3.max(data, (d) => +d.view_count)) * 0.1));

        this.scatter.select(".tl3")
            .attr("y", newY((d3.max(data, (d) => +d.view_count) / 1.4) * 0.1))//magic number here
            .attr("x", newX(d3.max(data, (d) => +d.view_count) / 1.4))
            .attr('text-anchor', 'middle')
            .attr("class", "texts tl3")
            .text("10%");

        this.scatter
            .select(".l4")
            .attr("class", "lines l4")
            .style("stroke", "black")
            .style("stroke-width", 0.5)
            .attr("x1", newX(0))
            .attr("y1", newY(0))
            .attr("x2", newX(d3.max(data, (d) => +d.view_count)))
            .attr("y2", newY((d3.max(data, (d) => +d.view_count)) * 0.2));

        this.scatter.select(".tl4")
            .attr("y", newY((d3.max(data, (d) => +d.view_count) / 2.8) * 0.2))//magic number here
            .attr("x", newX(d3.max(data, (d) => +d.view_count) / 2.8))
            .attr('text-anchor', 'middle')
            .attr("class", "texts tl4")
            .text("20%");

        /**/
        //scatter
        this.scatter
            .selectAll("circle.circleValues")
            .data(data, (d) => d.title)
            .join("circle")
            //.transition().duration(1000)
            .attr("class", "circleValues itemValue")
            .attr("cx", (d) => newX(d.view_count))
            .attr("cy", (d) => newY(d.likes))
            .attr("r", 3)
            .style("fill", (d) => this.color(d.chan_subscribers))
            .style("opacity", 0.5)
            .on("mouseover", (event, d) => this.handleMouseOverScatter(d))
            .on("mouseleave", (event, d) => this.handleMouseLeaveScatter(d))
            .append("title")
            .text((d) => "Title: " + d.title + "\nChannel: " + d.channelTitle + "\nViews: " + d.view_count + "\nLikes: " + d.likes + "\nComments: " + d.comment_count + "\nTitle Length: " + d.title_length);

        /** /
        if (!this.init) {
            var size = 20
            this.legend.selectAll("legendrects")
            .data(Object.keys(categories))
            .enter()
            .append("rect")
                .attr("x", this.width + 55)
                .attr("y", i => 100 + i*(size+5)) 
                .attr("width", size)
                .attr("height", size)
                .style("fill", d => colorschemes['species'](d));
            
            this.legend.selectAll("legendlabels")
            .data(Object.keys(categories))
            .enter()
            .append("text")
                .attr("x", this.width + 55 + size*1.2)
                .attr("y", i => 100 + i*(size+5) + (size/2)) 
                .style("fill", "black")
                .text(d => categories[d])
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")

            this.init = true;
        }
        /**/
    }

    handleMouseOverScatter(item) {


        d3.selectAll("circle.circleValues")
            .filter((d) =>
                d.title == item.title
            )
            .attr("class", "circleValues itemValue")
            .attr("r", 4)
            .style("fill", "#006666")
            .style("opacity", 1);

        this.circlePack.nodes
            .filter((d) =>
                (d.children != undefined && d.parent != null)
            )
            .filter((d) => (d.data[0] == item.chan_category))
            .style("fill", "#006666") //#ff3333
            .style("opacity", 1);

        this.circlePack.nodes
            .filter((d) =>
                (d.children == undefined)
            )
            .filter((d) => (d.data.channelTitle == item.channelTitle))
            .style("fill", "red")
            .style("opacity", 1)
            ;
        this.clockHeatMap.morning_slices.filter(function (d) {
            var hour_of_publishing = item.publishedAt.split("t")[1].split(":")[0];
            return hour_of_publishing == d.label;
        })
            .style("fill", "red");

        this.clockHeatMap.evening_slices.filter(function (d) {
            var hour_of_publishing = item.publishedAt.split("t")[1].split(":")[0];
            return hour_of_publishing == d.label;
        })
            .style("fill", "red");
    }
    handleMouseLeaveScatter(d) {
        var color = d3.scaleThreshold()
            .domain([20000000, 40000000, 60000000, 80000000])
            .range(["#ffb3b3", "#ff6666", "#ff1a1a", "#cc0000", "#800000"]);

        d3.selectAll("circle.circleValues")
            .attr("class", "circleValues itemValue")
            .attr("r", 3)
            .style("fill", function (d) { return color(d.chan_subscribers) })
            .style("opacity", 0.5)
            ;

        var color2 = d3.scaleThreshold()
        .domain([0.1, 5, 10, 20, 30, 100, 200, 300])
        .range(["white","#f9ecf9", "#ecc6ec", "#df9fdf", "#d279d2", "#c653c6", "#ac39ac", "#862d86", "#602060"]); //"#391339" "#130613" 
        this.circlePack.nodes.filter((d) => !this.circlePack.isSelected(d, true, "scater leave paint other colors"))
            .style("fill", function (d) {
                if (d.children == undefined) {
                    return color2(d.data.chan_number_trending_videos);
                }
                if (d.children != undefined && d.parent != null) {
                    var sum = 0;
                    for (let a of d.children) {
                        sum = sum + (+a.data.chan_number_trending_videos);
                    }
                    //console.log(color(sum))
                    return color2(sum);
                }
            })
            .style("stroke", "black")
            .style("opacity", 1)
            ;

        this.circlePack.nodes.filter(this.function = (d) => this.circlePack.isSelected(d, true, "scater leave paint red"))
            .style("fill", "red")
            .style("stroke", "black")
            .style("opacity", 1)
            ;

        var video_data = this.clockHeatMap.filteredData;
        this.clockHeatMap.morning_slices
            .style("fill", function (d) {
                var sum = 0;
                for (let v of video_data) {
                    var hour_of_publishing = v.publishedAt.split("t")[1].split(":")[0];
                    if (hour_of_publishing == d.label) {
                        sum++;
                    }
                }
                return color2(sum);
            });
        this.clockHeatMap.morning_slices.filter(this.function = (d) => {
            if (this.clockHeatMap.selected !== null) {
                return d.label === this.clockHeatMap.selected.label
            }

        })
            .style("fill", "red")
            ;
        this.clockHeatMap.evening_slices
            .style("fill", function (d) {
                var sum = 0;
                for (let v of video_data) {
                    var hour_of_publishing = v.publishedAt.split("t")[1].split(":")[0];
                    if (hour_of_publishing == d.label) {
                        sum++;
                    }
                }
                return color2(sum);
            });
        this.clockHeatMap.evening_slices.filter(this.function = (d) => {
            if (this.clockHeatMap.selected !== null) {
                return d.label === this.clockHeatMap.selected.label
            }

        })
            .style("fill", "red")
            ;
    }


}