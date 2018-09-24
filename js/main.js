var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
  },
  width = 1000,
  height = 500,
  radius = Math.min(width, height) / 2,
  iwidth = width - margin.left - margin.right,
  iheight = height - margin.top - margin.bottom;

console.log("iwidth: " + iwidth + "    " + "iheight: " + iheight);

const url = "https://raw.githubusercontent.com/santiagoconde0/incautacion-estupefacientes-2018/master/Incautacion-estupefacientes-2018.csv";

d3.csv(url).then(data => {

  var maxCant = d3.max(data, function(d) { return +d.CANTIDAD; });

  // var maxCant = 8385400;
  var minCant = d3.min(data, function(d) { return +d.CANTIDAD; });

  console.log("Cantidad Maxima:  " + maxCant);
  console.log("Cantidad minima:  " + minCant);


  var svg = d3
    .select("#target")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


  const y = d3.scaleLinear()
    .domain([minCant, maxCant])
    .range([iheight, 0]);

  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", () => Math.random() * iwidth)
    .attr("cy", d => y(d.CANTIDAD))
    .attr("r", 1);

});
