function demoInfo(agencyName) {
  d3.json("GA-13-georgia-counties.json").then((data) => {
    let result = data.filter((agency) => agency["Agency Name"] === agencyName);
    let resultData = result[0];

    d3.select("#sample-metadata").html("");
    Object.entries(resultData).forEach(([key, value]) => {
      d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
    });
  });
}

function initialize() {
  let select = d3.select("#selDataset");
  d3.json("GA-13-georgia-counties.json").then((data) => {
    data.forEach((sample) => {
      select
        .append("option")
        .text(sample["Agency Name"])
        .property("value", sample["Agency Name"]);
    });

    demoInfo(data[0]["Agency Name"]);
  });
}

function optionChanged(item) {
  demoInfo(item);
}
initialize();

// data.forEach((item) => {
//   if(item['name']===name){
//     result.push(item);
//   }
// })
