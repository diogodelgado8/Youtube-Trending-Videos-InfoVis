function init() {
  createPieChart("#vi1");
  d3.select("#genderButton").on("click", () => updatePieChart("gender"));
  d3.select("#ageButton").on("click", () => updatePieChart("age"));
}

function updatePieChart(button) {
  const width = 450,
    height = 450,
    margin = 40;

  const radius = Math.min(width, height) / 2 - margin;

  const svg = d3.select("#pieChart");

  d3.csv("./data/heart.csv").then(function (pieData) {
    let data = new Map();

    if (button == "age") {
      data.set("< 40", 0);
      data.set("40-60", 0);
      data.set("60 <", 0);
      pieData.forEach((d) => {
        if (0 < d.age && d.age <= 40) data.set("< 40", data.get("< 40") + 1);
        else if (40 < d.age && d.age <= 60)
          data.set("40-60", data.get("40-60") + 1);
        else if (60 < d.age) data.set("60 <", data.get("60 <") + 1);
      });
    } else {
      data.set("Male", 0);
      data.set("Female", 0);
      pieData.forEach((d) => {
        if (d.sex == 1) data.set("Male", data.get("Male") + 1);
        else data.set("Female", data.get("Female") + 1);
      });
    }

    const color = d3.scaleOrdinal().range(d3.schemeCategory10);

    const pie = d3.pie().value(function (d) {
      return d[1];
    });

    const data_ready = pie(Object.entries(Object.fromEntries(data)));

    const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

    svg
      .selectAll("path.pieChart")
      .data(data_ready)
      .join("path")
      .attr("class", "pieChart")
      .attr("d", arcGenerator)
      .attr("fill", function (d) {
        return color(d.data[0]);
      })
      .attr("stroke", "black")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    svg
      .selectAll("text.pieChart")
      .data(data_ready)
      .join("text")
      .attr("class", "pieChart")
      .text(function (d) {
        return d.data[0];
      })
      .attr("transform", function (d) {
        return `translate(${arcGenerator.centroid(d)})`;
      })
      .style("text-anchor", "middle")
      .style("font-size", 17);
  });
}

function createPieChart(id) {
  const width = 450,
    height = 450,
    margin = 40;

  const radius = Math.min(width, height) / 2 - margin;

  const svg = d3
    .select(id)
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("id", "pieChart")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  d3.csv("./data/heart.csv").then(function (pieData) {
    data = new Map();
    data.set("Male", 0);
    data.set("Female", 0);
    pieData.forEach((d) => {
      if (d.sex == 1) data.set("Male", data.get("Male") + 1);
      else data.set("Female", data.get("Female") + 1);
    });

    const color = d3.scaleOrdinal().range(d3.schemeCategory10);

    const pie = d3.pie().value(function (d) {
      return d[1];
    });
    const data_ready = pie(Object.entries(Object.fromEntries(data)));

    const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

    svg
      .selectAll("path.pieChart")
      .data(data_ready)
      .join("path")
      .attr("class", "pieChart")
      .attr("d", arcGenerator)
      .attr("fill", function (d) {
        return color(d.data[0]);
      })
      .attr("stroke", "black")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    svg
      .selectAll("text.pieChart")
      .data(data_ready)
      .join("text")
      .attr("class", "pieChart")
      .text(function (d) {
        return d.data[0];
      })
      .attr("transform", function (d) {
        return `translate(${arcGenerator.centroid(d)})`;
      })
      .style("text-anchor", "middle")
      .style("font-size", 17);

    svg
      .append("g")
      .attr("transform", `translate(${-width / 2}, 200)`)
      .append("text")
      .attr("fill", "currentColor")
      .text("Number of heart attacks")
      .attr("x", 15)
      .attr("y", 20);
  });
}
