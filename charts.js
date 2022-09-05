function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // Create a variable that holds the samples array. 
    var samples = data.samples;

    // Create a variable that filters the samples for the object with the desired sample number.
    let filteredSample = samples.filter(samples => samples.id == sample);

    // Create a variable that filters the metadata array for the object with the desired sample number.
    var resultArray = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // Create a variable that holds the first sample in the array.
    let firstSample = filteredSample[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuIds = firstSample.otu_ids.slice(0,10).reverse();
    let otuLabels = firstSample.otu_labels.slice(0,10).reverse();
    let values = firstSample.sample_values.slice(0,10).reverse();

    // Create a variable (float) that holds the washing frequency.
    let washfrequency = parseFloat(result.wfreq);

    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.map(otuId => "OTU " + otuId);

    // Create the trace for the bar chart. 
    var barData = [{
      type: 'bar',
      x: values,
      y: yticks,
      text: otuLabels,
      orientation: 'h'
    }];

    // Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found'
    };
    
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);

    // Bubble Chart
    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: firstSample.otu_ids,
      y: firstSample.sample_values,
      text: firstSample.otu_labels,
      mode: 'markers',
      marker: {
        color: firstSample.otu_ids,
        size: firstSample.sample_values
      }
    }];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: 'OTU ID'},
      showlegend: false,
      height: 600,
      width: 1200      
    };

    // Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 


    // Gauge Chart
    // Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washfrequency,
        title: { text: "Belly Button Washing Frequency", 
                 font: { size: 24}
               },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10], 
                  tickwidth: 1, 
                  tickcolor: "black",
                },
          bar: { color: "black" },
          bgcolor: "white",
          bordercolor: "gray",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" },
          ]
        }
      }
    ];
    
    // Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 600, height: 500, margin: { t: 0, b: 0 }
    };

    // Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
