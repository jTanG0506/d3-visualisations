async function drawBars() {
  const dataset = await d3.json("./../data/weather_data.json");

  const metricAccessor = d => d.humidity;
  const yAccessor = d => d.length;

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
    .domain([0, 1])
    .range([0, dimensions.boundedWidth])
    .nice();

  const binGenerator = d3.histogram()
    .domain(xScale.domain())
    .value(metricAccessor)
    .thresholds([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.01]);

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
    .attr("fill", "cornflowerblue");

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
    .text("Humidity")
}

drawBars();