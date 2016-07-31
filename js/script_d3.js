var IndiaChart = function(){
  var margin = {top: 20, right: 20, bottom: 70, left: 40},
				outerWidth = 1000 - margin.left - margin.right,
				outerHeight = 500 - margin.top - margin.bottom;

  var xColumn = "Year";
  var yColumn = "Value";

  var xAxisLabelText = "Year";
  var xAxisLabelOffset = 48;

  var yAxisLabelText = "Value";
  var yAxisLabelOffset = 40;

  var innerWidth  = outerWidth  - margin.left - margin.right;
  var innerHeight = outerHeight - margin.top  - margin.bottom;

  svg = d3.select("#area1")
		.append("svg")
		.attr("width", outerWidth + margin.left + margin.right)
		.attr("height", outerHeight + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate("+ margin.left + "," + margin.top +")");

  var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var path = g.append("path")
		.attr("class", "chart-line")
		.style("stroke-dasharray", ("3, 3"));

  var path1 = g.append("path")
		.attr("class", "chart-line-second")
		.style("stroke-dasharray", ("3, 3"));

  var xAxisG = g.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + innerHeight + ")");

  var xAxisLabel = xAxisG.append("text")
		.attr("transform", "translate(" + (innerWidth / 2) + "," + xAxisLabelOffset + ")")
		.attr("class", "label")
		.text(xAxisLabelText);

  var yAxisG = g.append("g")
		.attr("class", "axis");

  var yAxisLabel = yAxisG.append("text")
		.attr("transform", "translate(-" + yAxisLabelOffset + "," + (innerHeight / 2) + ") rotate(-90)")
		.attr("class", "label")
		.text(yAxisLabelText);

  var xScale = d3.time.scale().range([0, innerWidth]);
  var yScale = d3.scale.linear().range([innerHeight, 0]);

  var colors = d3.scale.category20()

  var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");

  var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left");

  var line = d3.svg.line()
		.x(function(d) { return xScale(d[xColumn]);})
		.y(function(d) { return yScale(d[yColumn]); });

  var urbarr=[];
  var rurarr=[];

  d3.json("lineChart.json", function(error, data) {
	if (error) throw error;
		data.forEach(function(d){
			d.Year=new Date(d.Year,0);
		});
    for(var i=1;i<data.length;i++){
      if(i%2==0){
        urbarr.push(data[i]);
      }else{
        rurarr.push(data[i]);
      }
    }
    xScale.domain(d3.extent(data, function (d){ return d[xColumn]; }));
    yScale.domain([0, d3.max(data, function (d){ return d[yColumn]; })]);
    xAxisG.call(xAxis);
    yAxisG.call(yAxis);
    path.attr("d", line(urbarr));
    path1.attr("d", line(rurarr));
  });
};

var AsiaChart = function(){
  var margin={top:20, bottom:100, left:130, right:50},
			width=1300-margin.left-margin.right,
			height=600-margin.top-margin.bottom;

  var horizontal=d3.scale.ordinal().rangeRoundBands([0,width],0.25),
		vertical=d3.scale.linear().rangeRound([height,0]);

  var color = d3.scale.linear()
    .range(["#1CB9C3", "#F0EA68"]);

  var xAxis=d3.svg.axis()
		.scale(horizontal)
		.orient("bottom");

  var yAxis=d3.svg.axis()
		.scale(vertical)
		.orient("left");

  var svg=d3.select("#area2").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var urban = [];
  var rural = [];

  d3.json("barChart.json",function(err,data){
	data.forEach(function(d){
		d.year=d.year;
  });
  for(var i=1;i<data.length;i++){
      if(i%2==0){
        urban.push(data[i].Value);
      }else{
        rural.push(data[i].Value);
      }
    }
	rural=rural;
	urban=urban;
  var xData=["urban","rural"];
  var dataIntermediate = xData.map(function (c) {
      return data.map(function (d) {
      return {x: d.year, y: d[c]};});
    });
  var dataStackLayout = d3.layout.stack()(dataIntermediate);

  horizontal.domain(dataStackLayout[0].map(function (d) {
      return d.x;}));

  vertical.domain([0, d3.max(dataStackLayout[dataStackLayout.length - 1],
    function (d) { return d.y0 + d.y;})])
    .nice();
  var layer = svg.selectAll(".stack")
		.data(dataStackLayout)
		.enter().append("g")
		.attr("class", "stack")
		.style("fill", function (d, i) {
		 return color(i);
    });

  layer.selectAll("rect")
    .data(function (d) {
          return d;})
    .enter().append("rect")
    .attr("x", function (d) {
          return horizontal(d.x);})
    .attr("y", function (d) {
          return vertical(d.y + d.y0);})
    .attr("height", function (d) {
          return vertical(d.y0) - vertical(d.y + d.y0);})
    .attr("width", horizontal.rangeBand());

  svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.selectAll("text")
    .attr("dx", "-2em")
    .attr("dy", "0")
    .attr("transform", "rotate(-90)" )
    .append("text")
		.attr("transform", "translate(" + width + "0)")
		.text("Years");

  svg.append("g")
		.attr("class", "axis")
		.call(yAxis)
		.append("text")
    .attr("transform", "rotate(-90)")
    .attr("dy","1em")
    .style("text-anchor", "end")
    .text("Values");

   var legend = svg.selectAll(".legend")
    .data(color.domain().slice().reverse())
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

   legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

   legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .style("fill","green")
    .text(function(d,i) { return xData[i] });

  legend.append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .style("fill","black")
    .text(function(d,i) { return xData[i] });
});
};

IndiaChart();
AsiaChart();
