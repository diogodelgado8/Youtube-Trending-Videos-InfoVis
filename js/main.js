function init() {
  const circle_selection = [];
  d3.csv("./data/dataset.csv").then(function (data) {
  d3.csv("./data/most_subscribed_youtube_channels_clean.csv").then(function (data2) {
  // createHeatMap(data,"#vi1")
  /**/
  console.log("START");
  circle_packing = new CirclePacking("#vi2",data2);
  scaterplot = new ScatterPlot("#vi4",data);
  clockHeatMap = new ClockHeatMap("#vi1",data);
  console.log("INIT");
  circle_packing.initialize(scaterplot,clockHeatMap);
  scaterplot.initialize(circle_packing, clockHeatMap);
  clockHeatMap.initialize(scaterplot, circle_packing);
  console.log("UPDATE");
  circle_packing.update();
  scaterplot.update();
  clockHeatMap.update();
  //createDonnut(data);
  
  /**/
  //createCircularPacking(data2,"#vi2",circle_selection)
  // createCorrelationMatrix(data,"#vi3")
  //createScatterPlot(data,"#vi4")
  })
  })
  ;
}

