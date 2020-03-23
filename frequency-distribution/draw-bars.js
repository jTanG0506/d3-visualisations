async function drawBars() {
  const dataset = await d3.json("./../data/weather_data.json");

  const width = 600;
  let dimensions = {
    width: width,
    height: width * 0.6,
    margin: {
      top: 30,
      right: 10,
      bottom: 50,
      left: 50,
    }
  };

  let marginWidth = dimensions.margin.left + dimensions.margin.right;
  let marginHeight = dimensions.margin.top + dimensions.margin.bottom;
  dimensions.boundedWidth = dimensions.width - marginWidth;
  dimensions.boundedHeight = dimensions.height - marginHeight;

  const drawHistogram = metric => {
    const metricAccessor = d => d[metric];
    const yAccessor = d => d.length;

    const wrapper = d3.select("#wrapper")
      .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height);

    const bounds = wrapper.append("g")
      .style("transform", `translate(${
        dimensions.margin.left
      }px, ${
        dimensions.margin.top
      }px)`);

    let xScale = d3.scaleLinear()
      .domain(d3.extent(dataset, metricAccessor))
      .range([0, dimensions.boundedWidth])
      .nice();

    const binGenerator = d3.histogram()
      .domain(xScale.domain())
      .value(metricAccessor)
      .thresholds(10);

    const bins = binGenerator(dataset);
    console.log(bins);
    
    let yScale = d3.scaleLinear()
      .domain([0, d3.max(bins, yAccessor)])
      .range([dimensions.boundedHeight, 0])
      .nice();

    const binsGroup = bounds.append("g")
    const binGroups = binsGroup.selectAll("g")
      .data(bins)
      .enter()
      .append("g");

    const barPadding = 1;

    const barRects = binGroups.append("rect")
      .attr("x", d => xScale(d.x0) + barPadding / 2)
      .attr("y", d => yScale(yAccessor(d)))
      .attr("width", d => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))
      .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
      .attr("fill", "#50E3C2");

    const barText = binGroups.filter(yAccessor)
      .append("text")
      .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr("y", d => yScale(yAccessor(d)) - 5)
      .attr("fill", "darkgrey")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-family", "sans-serif")
      .text(yAccessor);

    const xAxisGenerator = d3.axisBottom()
      .scale(xScale);
    const xAxis = bounds.append("g")
      .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`);
    const xAxisLabel = xAxis.append("text")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
      .attr("fill", "black")
      .style("font-size", "1.3em")
      .style("text-transform", "capitalize")
      .text(metric);

    const mean = d3.mean(dataset, metricAccessor);
    const meanLine = bounds.append("line")
      .attr("x1", xScale(mean))
      .attr("x2", xScale(mean))
      .attr("y1", -15)
      .attr("y2", dimensions.boundedHeight)
      .attr("stroke", "#7433FF")
      .attr("stroke-dasharray", "2px 4px");
    const meanLabel = bounds.append("text")
      .attr("x", xScale(mean))
      .attr("y", -20)
      .attr("fill", "#7433FF")
      .style("font-size", "12px")
      .style("text-anchor", "middle")
      .text(`mean (${Math.round(mean * 100) / 100})`);
  }

  const metrics = [
    "windSpeed",
    "moonPhase",
    "dewPoint",
    "humidity",
    "uvIndex",
    "windBearing",
    "temperatureMin",
    "temperatureMax"
  ];

  metrics.forEach(drawHistogram);
}

drawBars();
