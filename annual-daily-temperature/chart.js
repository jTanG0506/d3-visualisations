async function drawLineChart() {
  const dataset = await d3.json("./../data/weather_data.json");

  const dateParser = d3.timeParse("%Y-%m-%d");
  const fahrenheitToCelsius = f => (f - 32) * 5 / 9;
  const yAccessor = d => fahrenheitToCelsius(d.temperatureMax);
  const xAccessor = d => dateParser(d.date);

  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
    },
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

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0]);

  const xScale = d3.scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth]);

  const lineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)));

  const line = bounds.append("path")
    .attr("d", lineGenerator(dataset))
    .attr("fill", "none")
    .attr("stroke", "#7F33FF")
    .attr("stroke-width", 2);

  const yAxisGenerator = d3.axisLeft().scale(yScale);
  const yAxis = bounds.append("g")
    .call(yAxisGenerator);

  const xAxisGenerator = d3.axisBottom().scale(xScale);
  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${
      dimensions.boundedHeight
    }px)`);
}

drawLineChart();
