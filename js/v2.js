const url = "https://raw.githubusercontent.com/santiagoconde0/incautacion-estupefacientes-2018-1/master/data/data.csv";

d3.csv(url).then(data => { // Get Data

  var margin = {
      top: 50,
      right: 90,
      bottom: 50,
      left: 110
    },
    width = 1100,
    height = 500,
    radius = Math.min(width, height) / 2,
    iwidth = width - margin.left - margin.right,
    iheight = height - margin.top - margin.bottom;

  // console.log("iwidth: " + iwidth + "    " + "iheight: " + iheight);
  const listDay = {
    dat: d3
      .nest().key(d => {
        return d.DIA;
      })
      .rollup(d => {
        return d3.sum(d, d => +d.CANTIDAD);
      })
      .entries(data)
  };


  var dataIndex = 1;

  var maxCant = d3.max(listDay.dat, d => +d.value);
  var minCant = d3.min(listDay.dat, d => +d.value);

  // console.log("Cantidad Maxima:  " + maxCant);
  // console.log("Cantidad minima:  " + minCant);
  var svg2 = d3 // create the SVG
    .select("#target3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const filteredData = listDay.dat //order
    .sort((a, b) => d3.descending(a.value, b.value));

  const filteredData2 = filteredData.filter(function(d) { // delet the undefine datas
    if (d.value > 0) {
      return true;
    }
  });

  const departamentos = d3.set(data.map(d => d.DEPARTAMENTO)).values();

  var select = d3.select("#target") // create dropdown
    .append("select")
    .attr("class", "select")
    .attr("id", "selector")
    .on("change", onchange);

  var options = select //options for the dropdown
    .selectAll("option")
    .data(departamentos).enter()
    .append("option")
    .text(d => d);


  function onchange() {

    console.log(dataIndex);

    if (dataIndex == 1) {
      dataIndex = 2;
    } else {
      dataIndex = 1;
    }

    var selected = d3.select("#selector").node().value;

    const dep = data.filter(function(d) {
      if (d.DEPARTAMENTO == selected) {
        return true;
      }
    });
    console.log(dep);

  };

  var y = d3.scaleLinear() // y axis scale
    .domain([minCant, maxCant])
    .range([iheight, minCant]);
  // console.log(minCant + "   " +maxCant);

  const x = d3.scaleBand() // x axis scale
    .padding(0.1)
    .domain(filteredData2.map(d => d.key))
    .range([0, iwidth]);

  svg2.append("g") // Y axis
    .call(d3.axisLeft(y));

  svg2.append("g") // X axis
    .attr("transform", `translate(0,${iheight})`)
    .call(d3.axisBottom(x));

  svg2.append("text") // x axis label
    .attr("x", iwidth / 2)
    .attr("y", height - 60)
    .text("Dia de la semana");

  svg2.append("text") // Y axis label
    .attr("transform", "rotate(-90)")
    .attr("x", -iheight / 2)
    .attr("y", -margin.right)
    .text("Cantidad");

  svg2.append("text") // Y axis label
    .attr("transform", "rotate(-90)")
    .attr("x", -iheight / 2)
    .attr("y", -margin.right)
    .attr("dy", "1em")
    .text("(Gramos)")
    .attr("id", "VIZ");

  svg2.selectAll("rect") // insrt bars
    .data(listDay.dat)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("id", "VIZ")
    .style("visibility", "visible")
    .attr("x", d => x(d.key))
    .attr("y", d => y(d.value))
    .attr("height", d => y(0) - y(d.value))
    .attr("width", x.bandwidth())
    .attr("fill", "#77dd77");

});
