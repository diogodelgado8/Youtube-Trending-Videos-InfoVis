class ClockHeatMap {
    margin = { top: 200, right: 50, bottom: 50, left: 150 };
    constructor(svg, data, width = 420, height = 700) {
        this.svg_id = svg;
        this.data = data;
        this.height = height - this.margin.top - this.margin.bottom;
        this.width = width - this.margin.left - this.margin.right;
        this.arcGenerator = d3.arc()
            .innerRadius(35)
            .outerRadius(140)
            .padAngle(.05)
            .padRadius(50)
            .cornerRadius(5);
        this.arc_intereval = (2 * Math.PI) / 12
        var intereval = this.arc_intereval
        this.arcData_morning = [
            { label: "00", startAngle: 0, endAngle: intereval },
            { label: "01", startAngle: intereval, endAngle: 2 * intereval },
            { label: "02", startAngle: 2 * intereval, endAngle: 3 * intereval },
            { label: "03", startAngle: 3 * intereval, endAngle: 4 * intereval },
            { label: "04", startAngle: 4 * intereval, endAngle: 5 * intereval },
            { label: "05", startAngle: 5 * intereval, endAngle: 6 * intereval },
            { label: "06", startAngle: 6 * intereval, endAngle: 7 * intereval },
            { label: "07", startAngle: 7 * intereval, endAngle: 8 * intereval },
            { label: "08", startAngle: 8 * intereval, endAngle: 9 * intereval },
            { label: "09", startAngle: 9 * intereval, endAngle: 10 * intereval },
            { label: "10", startAngle: 10 * intereval, endAngle: 11 * intereval },
            { label: "11", startAngle: 11 * intereval, endAngle: 12 * intereval },

        ];
        this.arcData_evening = [
            { label: "12", startAngle: 0, endAngle: intereval },
            { label: "13", startAngle: intereval, endAngle: 2 * intereval },
            { label: "14", startAngle: 2 * intereval, endAngle: 3 * intereval },
            { label: "15", startAngle: 3 * intereval, endAngle: 4 * intereval },
            { label: "16", startAngle: 4 * intereval, endAngle: 5 * intereval },
            { label: "17", startAngle: 5 * intereval, endAngle: 6 * intereval },
            { label: "18", startAngle: 6 * intereval, endAngle: 7 * intereval },
            { label: "19", startAngle: 7 * intereval, endAngle: 8 * intereval },
            { label: "20", startAngle: 8 * intereval, endAngle: 9 * intereval },
            { label: "21", startAngle: 9 * intereval, endAngle: 10 * intereval },
            { label: "22", startAngle: 10 * intereval, endAngle: 11 * intereval },
            { label: "23", startAngle: 11 * intereval, endAngle: 12 * intereval },

        ];
    }
    initialize(scatterplot, circlePack) {
        this.scatterplot = scatterplot;
        this.circlePack = circlePack;
        this.filteredData = this.data;
        this.svg = d3.select(this.svg_id);
        this.container = this.svg.append("g");
        this.morning_container = this.container.append("g");
        this.evening_container = this.container.append("g");

        this.svg
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.container.attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        this.evening_container.attr("transform", `translate(${0}, ${this.height / 1.5})`);
        this.selected = null;

        this.container.append("text")
            .attr("x", 100 - (this.width / 2))
            .attr("y", -53 - (this.margin.top / 2))
            .attr('pointer-events', 'none')
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .attr("class", "shadow")
            //.style("text-decoration", "underline")  
            .text("Trending Videos Published at Each Hour");
        this.morning_slices = this.morning_container
            .selectAll('path')
            .data(this.arcData_morning)
            .join('path')
            .attr('d', this.arcGenerator);
        this.evening_slices = this.evening_container
            .selectAll('path')
            .data(this.arcData_evening)
            .join('path')
            .attr('d', this.arcGenerator);
        this.morning_title = this.morning_slices
            .append("title");
        this.evening_title = this.evening_slices
            .append("title");

    }

    update() {
        var color = d3.scaleThreshold()
            .domain([0.1, 5, 10, 20, 30, 100, 200, 300])
            .range(["white", "#f9ecf9", "#ecc6ec", "#df9fdf", "#d279d2", "#c653c6", "#ac39ac", "#862d86", "#602060"]); //"#391339" "#130613" 
        var video_data = this.filteredData;

        this.morning_slices
            .style("fill", this.function = (d) => {
                if (!this.isSelected(d)) {
                    var sum = 0;

                    for (let v of video_data) {
                        var hour_of_publishing = v.publishedAt.split("t")[1].split(":")[0];
                        if (hour_of_publishing == d.label) {

                            sum++;
                        }
                    }
                    return color(sum);
                }
                else {
                    return "red"
                }
            })
            .style("stroke", "black")
            .on("mouseover", (event, d) => this.handleMouseOverClock(d))
            .on("mouseleave", (event, d) => this.handleMouseLeaveClock(d))
            .on("click", (event, d) => this.handleMouseClickClock(d))
            ;

        this.morning_slices.attr('pointer-events', 'all');
        this.morning_slices.filter(this.function = (d) => {
            var sum = 0;

            for (let v of video_data) {
                var hour_of_publishing = v.publishedAt.split("t")[1].split(":")[0];
                if (hour_of_publishing == d.label) {

                    sum++;
                }
            }
            return sum == 0;
        }).attr('pointer-events', 'none');

        this.evening_slices
            .style("fill", this.function = (d) => {
                if (!this.isSelected(d)) {
                    var sum = 0;

                    for (let v of video_data) {
                        var hour_of_publishing = v.publishedAt.split("t")[1].split(":")[0];
                        if (hour_of_publishing == d.label) {

                            sum++;
                        }
                    }
                    return color(sum);
                }
                else {
                    return "red"
                }

            })
            .style("stroke", "black")
            .on("mouseover", (event, d) => this.handleMouseOverClock(d))
            .on("mouseleave", (event, d) => this.handleMouseLeaveClock(d))
            .on("click", (event, d) => this.handleMouseClickClock(d))
            ;
        this.evening_slices.attr('pointer-events', 'all');
        this.evening_slices.filter(this.function = (d) => {
            var sum = 0;

            for (let v of video_data) {
                var hour_of_publishing = v.publishedAt.split("t")[1].split(":")[0];
                if (hour_of_publishing == d.label) {

                    sum++;
                }
            }
            return sum == 0;
        }).attr('pointer-events', 'none');
        var tep_generator = this.arcGenerator;
        this.morning_container
            .selectAll('text')
            .data(this.arcData_morning)
            .join('text')
            .each(function (d) {
                var centroid = tep_generator.centroid(d);
                d3.select(this)
                    .attr('x', centroid[0])
                    .attr('y', centroid[1])
                    .attr('dy', '0.33em')
                    .attr('pointer-events', 'none')
                    .text(d.label);
            })

        this.evening_container
            .selectAll('text')
            .data(this.arcData_evening)
            .join('text')
            .each(function (d) {
                var centroid = tep_generator.centroid(d);
                d3.select(this)
                    .attr('x', centroid[0])
                    .attr('y', centroid[1])
                    .attr('dy', '0.33em')
                    .attr('pointer-events', 'none')
                    .text(d.label);
            })


        this.morning_title.text(this.function = (d) => {
            var sum = 0;
            for (let v of video_data) {
                var hour_of_publishing = v.publishedAt.split("t")[1].split(":")[0];
                if (hour_of_publishing == d.label) {
                    sum++;
                }
            }
            return ("Trending videos: " + sum);
        });

        this.evening_title.text(this.function = (d) => {
            var sum = 0;
            for (let v of video_data) {
                var hour_of_publishing = v.publishedAt.split("t")[1].split(":")[0];
                if (hour_of_publishing == d.label) {
                    sum++;
                }
            }
            return ("Trending videos: " + sum);
        });
    }

    handleMouseOverClock(item) {
        console.log("hover clock")
        console.log(item);
        console.log(this.morning_slices);
        this.morning_slices.filter((d) => d == item && !this.isSelected(item)).style("fill", "#006666")
        this.evening_slices.filter((d) => d == item && !this.isSelected(item)).style("fill", "#006666")

    }

    handleMouseLeaveClock(item) {
        var video_data = this.filteredData;
        var color = d3.scaleThreshold()
            .domain([0.1, 5, 10, 20, 30, 100, 200, 300])
            .range(["white", "#f9ecf9", "#ecc6ec", "#df9fdf", "#d279d2", "#c653c6", "#ac39ac", "#862d86", "#602060"]); //"#391339" "#130613" 
        this.morning_slices.filter((d) => !this.isSelected(d)).style("fill", function (d) {
            var sum = 0;
            for (let v of video_data) {
                var hour_of_publishing = v.publishedAt.split("t")[1].split(":")[0];
                if (hour_of_publishing == d.label) {

                    sum++;
                }
            }
            return color(sum);
        });
        this.evening_slices.filter((d) => !this.isSelected(d)).style("fill", function (d) {
            var sum = 0;
            for (let v of video_data) {
                var hour_of_publishing = v.publishedAt.split("t")[1].split(":")[0];
                if (hour_of_publishing == d.label) {

                    sum++;
                }
            }
            return color(sum);
        });

    }

    isSelected(item) {
        if (this.selected != null) {
            return this.selected.label === item.label;
        }
        else return false;
    }
    handleMouseClickClock(item) {
        var video_data = this.filteredData;
        var color = d3.scaleThreshold()
            .domain([0.1, 5, 10, 20, 30, 100, 200, 300])
            .range(["white", "#f9ecf9", "#ecc6ec", "#df9fdf", "#d279d2", "#c653c6", "#ac39ac", "#862d86", "#602060"]); //"#391339" "#130613" 

        this.morning_slices.style("fill", function (d) {
            var sum = 0;
            for (let v of video_data) {
                var hour_of_publishing = v.publishedAt.split("t")[1].split(":")[0];
                if (hour_of_publishing == d.label) {

                    sum++;
                }
            }
            return color(sum);
        });

        this.evening_slices.style("fill", function (d) {
            var sum = 0;
            for (let v of video_data) {
                var hour_of_publishing = v.publishedAt.split("t")[1].split(":")[0];
                if (hour_of_publishing == d.label) {

                    sum++;
                }
            }
            return color(sum);
        });

        if (!this.isSelected(item)) {
            this.selected = item;
            var video_data = this.filteredData;
            var filteredData = this.scatterplot.data
                .filter(this.function = (d) => {
                    var hour_of_publishing = d.publishedAt.split("t")[1].split(":")[0];
                    return hour_of_publishing == item.label
                });
            this.scatterplot.filteredData_clock = filteredData;
            var filteredChanelData = this.circlePack.data
                .filter(this.function = (d) => {
                    return filteredData.some((v) => v.channelTitle == d.channelTitle);
                });
            this.circlePack.filteredData = filteredChanelData;
        }
        else {
            this.selected = null;
            this.scatterplot.filteredData_clock = this.scatterplot.data
            this.circlePack.filteredData = this.circlePack.data;
        }
        this.scatterplot.update()
        this.circlePack.labelnodes.selectAll(".packingValueLabel").remove();
        this.circlePack.title_categoty.remove();
        this.circlePack.update();

        this.morning_slices.filter((d) => d == item && !this.isSelected(item)).style("fill", "#006666")
        this.evening_slices.filter((d) => d == item && !this.isSelected(item)).style("fill", "#006666")
        this.morning_slices.filter((d) => d == item && this.isSelected(item)).style("fill", "red")
        this.evening_slices.filter((d) => d == item && this.isSelected(item)).style("fill", "red")

        this.circlePack.nodes
            .style("fill", function (d) {
                if (d.children == undefined) {
                    return color(d.data.chan_number_trending_videos);
                }
                if (d.children != undefined && d.parent != null) {
                    var sum = 0;
                    for (let a of d.children) {
                        sum = sum + (+a.data.chan_number_trending_videos);
                    }
                    return color(sum);
                }
            })
            .style("stroke", "black")
            .style("opacity", 1)
            ;
        /**/
        this.circlePack.nodes.filter(this.function = (d) => this.circlePack.isSelected(d))
            .style("fill", "red")
            .style("stroke", "black")
            .style("opacity", 1)
            ;
        /**/

    }

}

