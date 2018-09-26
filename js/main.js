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

  // console.log("DATA LIST: ", listDay.dat);
  var dataIndex = 1;
  var maxCant = d3.max(listDay.dat, d => +d.value);
  var minCant = d3.min(listDay.dat, d => +d.value);

  // console.log("Cantidad Maxima:  " + maxCant);
  // console.log("Cantidad minima:  " + minCant);

  var svg = d3 // create the SVG
    .select("#target2")
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

  var y = d3.scaleLinear() // y axis scale
    .domain([0, maxCant])
    .range([iheight, 0]);

  const x = d3.scaleBand() // x axis scale
    .padding(0.1)
    .domain(filteredData2.map(d => d.key))
    .range([0, iwidth]);

  console.log("DATA: " + minCant);

  svg.append("g") // Y axis
    .call(d3.axisLeft(y));

  svg.append("g") // X axis
    .attr("transform", `translate(0,${iheight})`)
    .call(d3.axisBottom(x));

  svg.append("text") // x axis label
    .attr("x", iwidth / 2)
    .attr("y", height - 60)
    .text("Dia de la semana");

  svg.append("text") // Y axis label
    .attr("transform", "rotate(-90)")
    .attr("x", -iheight / 2)
    .attr("y", -margin.right)
    .text("Cantidad");

  svg.append("text") // Y axis label
    .attr("transform", "rotate(-90)")
    .attr("x", -iheight / 2)
    .attr("y", -margin.right)
    .attr("dy", "1em")
    .text("(Gramos)")
    .attr("id", "VIZ");

  svg.selectAll("rect") // insrt bars
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


d3.csv(url).then(data => { // Get Data

  d3.select("#target")
    .append("h3")
    .text("¿Cuál es el municipio con más incautaciones de estupesfacientes?");

  d3.select("#target")
    .append("br")

  d3.select("#target")
    .append("h6")
    .text("Seleccione la cantidad de municipios que desea visualizar");


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
    d3.select("svg").remove();
    d3.select("#target2").remove();

    d3.select('#target')
      .append('div')
      .attr("id", "target2")

    update();
  };

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

  function update() {

    var selected = d3.select("#selector").node().value;
    const dep = data.filter(function(d) {
      if (d.DEPARTAMENTO == selected) {
        return true;
      }
    });

    const listDay = {
      dat: d3
        .nest().key(d => {
          return d.DIA;
        })
        .rollup(d => {
          return d3.sum(d, d => +d.CANTIDAD);
        })
        .entries(dep)
    };

    console.log("DATA LIST: ", listDay.dat);
    var dataIndex = 1;
    var maxCant = d3.max(listDay.dat, d => +d.value);
    var minCant = d3.min(listDay.dat, d => +d.value);

    // console.log("Cantidad Maxima:  " + maxCant);
    // console.log("Cantidad minima:  " + minCant);

    var svg = d3 // create the SVG
      .select("#target2")
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

    var y = d3.scaleLinear() // y axis scale
      .domain([0, maxCant])
      .range([iheight, 0]);

    const x = d3.scaleBand() // x axis scale
      .padding(0.1)
      .domain(filteredData2.map(d => d.key))
      .range([0, iwidth]);

    console.log("DATA: " + minCant);

    svg.append("g") // Y axis
      .call(d3.axisLeft(y));

    svg.append("g") // X axis
      .attr("transform", `translate(0,${iheight})`)
      .call(d3.axisBottom(x));

    svg.append("text") // x axis label
      .attr("x", iwidth / 2)
      .attr("y", height - 60)
      .text("Dia de la semana");

    svg.append("text") // Y axis label
      .attr("transform", "rotate(-90)")
      .attr("x", -iheight / 2)
      .attr("y", -margin.right)
      .text("Cantidad");

    svg.append("text") // Y axis label
      .attr("transform", "rotate(-90)")
      .attr("x", -iheight / 2)
      .attr("y", -margin.right)
      .attr("dy", "1em")
      .text("(Gramos)")
      .attr("id", "VIZ");

    svg.selectAll("rect") // insrt bars
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
  };


});

d3.select("#target3")
  .append("h3")
  .text("Insight No.1");

d3.select("#target3")
  .append("h5")
  .text("El día de la semana en el que se encautan más estupefacientes es el día lunes");

d3.select("#target3")
  .append("br");
d3.select("#target3")
  .append("br");

d3.select("#target4")
  .append("h3")
  .text("¿Cuál es el municipio con más incautaciones de estupesfacientes?");

//
// -----------------------------------------------------------------------------------------
// Segunda Grafica
// -----------------------------------------------------------------------------------------


d3.csv(url).then(data => { // Get Data

  var margin = {
      top: 50,
      right: 90,
      bottom: 50,
      left: 115
    },
    width = 1100,
    height = 1000,
    radius = Math.min(width, height) / 2,
    iwidth = width - margin.left - margin.right,
    iheight = height - margin.top - margin.bottom;

  // console.log("iwidth: " + iwidth + "    " + "iheight: " + iheight);x


  const listMunicipio = {
    dat: d3
      .nest().key(d => {
        return d.MUNICIPIO;
      })
      .rollup(d => {
        return d3.sum(d, d => +d.CANTIDAD);
      })
      .entries(data)
  };

  var maxCant = d3.max(listMunicipio.dat, d => +d.value);
  var minCant = d3.min(listMunicipio.dat, d => +d.value);

  var svg = d3 // create the SVG
    .select("#target4")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  const filteredData = listMunicipio.dat //order
    .sort((a, b) => d3.descending(a.value, b.value))
    .slice(0, 25);;

  console.log(filteredData);

  const filteredData2 = filteredData.filter(function(d) { // delet the undefine datas
    if (d.value > 0) {
      return true;
    }
  });

  const departamentos = d3.set(data.map(d => d.DEPARTAMENTO)).values();

  var x2 = d3.scaleLinear() // y axis scale
    .domain([minCant, maxCant])
    .range([minCant, iheight]);


  // console.log(minCant + "   " +maxCant);

  const y2 = d3.scaleBand() // x axis scale
    .padding(0.1)
    .domain(filteredData2.map(d => d.key))
    .range([0, iwidth]);

  svg.append("g") // Y axis
    .call(d3.axisLeft(y2));

  svg.append("g") // X axis
    .attr("transform", `translate(0,${iheight})`)
    .call(d3.axisBottom(x2));


  console.log("listamunicipios: ");

  console.log(listMunicipio.dat.map(d => +(d.value)));

  svg.selectAll("rect") // insrt bars
    .data(listMunicipio.dat)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .style("visibility", "visible")
    .attr("x", 3)
    .attr("y", function(d) {
      return y2(d.key);
    })
    .attr("width", d => +x2(d.value))
    .attr("height", y2.bandwidth())
    .attr("fill", "#77dd77");




});
