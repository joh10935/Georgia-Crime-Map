function demoInfo(data) {
  d3.json("GA_crimeData.json").then((data) => {
    console.log(data.results.ori);
    //let metaData = data.metadata;
    let results = data.results;
    let result = results.filter((sampleResult) => sampleResult.ori == sample);
    let resultData = result[0];
    console.log(resultData);
    d3.select("#sample-metadata").html("");
    Object.entries(resultData).forEach(([key, value]) => {
      d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
    });
  });
}

function initialize() {
  let select = d3.select("#selDataset");
  d3.json("GA_crimeData.json").then((data) => {
    let sampleNames = data.results;
    console.log(data);

    sampleNames.forEach((sample) => {
      select.append("option").text(sample).property("value", sample);
    });
    let sample1 = sampleNames[0];
    demoInfo(sample1);
  });
}

function optionChanged(item) {
  demoInfo(item);
}
initialize();
