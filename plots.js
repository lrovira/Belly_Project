function init() {
    var selector = d3.select("#selDataset");
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
      var firstSample = sampleNames[0];
      createCharts(firstSample);
      buildMetadata(firstSample);
  })
  }
  
  init();
  
  function optionChanged(newSample) {
    buildMetadata(newSample);
    createCharts(newSample);
  }
  
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
      PANEL.append("h6").text("ID:" + " " + result.id);
      PANEL.append("h6").text("ETHNICITY:" + " " + result.ethnicity);
      PANEL.append("h6").text("GENDER:" + " " + result.gender);
      PANEL.append("h6").text("AGE:" + " " + result.age);
      PANEL.append("h6").text("LOCATION:" + " " + result.location);
      PANEL.append("h6").text("BBTYPE:" + " " + result.bbtype);
      PANEL.append("h6").text("WFREQ:" + " " + result.wfreq);
      
    });
  }
  
  function createCharts(sample) {
    d3.json("samples.json").then((data) => {
      var samples = data.samples;
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
  
      var otu_id = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
  
      var bar_data = [{
        x: otu_id.slice(0,10).reverse(),
        y: sample_values.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
  
      }]
      
      Plotly.newPlot("bar", bar_data);
  
      var bubble_data = [{
        x:otu_id,
        y:sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_id,
        }
        
      }]
  
      Plotly.newPlot("bubble", bubble_data);
      
      var data = [
        {
          domain: { x: otu_id, y: otu_labels },
          value: 9,
          title: { text: "Belly Button Washing Frequency (Scrubs per week)" },
          type: "indicator",
          mode: "gauge+number+delta",
          delta: { reference: 7 },
          gauge: {
            axis: { range: [0, 9] },
            steps: [
              { range: [0, 5], color: "lightgray" },
              { range: [5, 9], color: "gray" }
            ],
            threshold: {
              line: { color: "red", width: 4 },
              thickness: 0.75,
              value: 490
            }
          }
        }
      ];
      
      var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
      
      Plotly.newPlot('gauge', data, layout);
  
  
  
    });
  }