function mapOffenseToYear(agencyData) {
  const crimeYears = {};
  agencyData.forEach(
    ({ offense, actual, year, percapita_income, county_name }) => {
      if (year !== null) {
        if (crimeYears[year] !== undefined) {
          crimeYears[year].offenseList.push({ offense, actual });
        } else {
          crimeYears[year] = {
            income: percapita_income,
            county: county_name,
            offenseList: [],
          };
          crimeYears[year].offenseList.push({ offense, actual });
        }
      }
    }
  );
  return crimeYears;
}

// Create a function for the Agency info bar
function demoInfoYear(year) {
  d3.json("offenses.json").then((data) => {
    let result = data.filter((agency) => agency["agency_name"] === year.agency);
    const mappedData = mapOffenseToYear(result);
    const filteredDataByYear = mappedData[year.year];

    d3.select("#agency_info").html("");

    d3.select("#agency_info")
      .append("h5")
      .text(`County: ${filteredDataByYear.county}`);

    d3.select("#agency_info")
      .append("h5")
      .text(`Income: ${filteredDataByYear.income}`);

    filteredDataByYear.offenseList.forEach((offense) => {
      d3.select("#agency_info")
        .append("h5")
        .text(
          `Offense: ${offense.offense} - Actual incidents: ${offense.actual} `
        );
    });
  });
}

function initializeYears(agencyName) {
  d3.json("offenses.json").then((data) => {
    let result = data.filter((agency) => agency["agency_name"] === agencyName);
    const mappedData = mapOffenseToYear(result);

    let select = d3.select("#yearDataset");
    d3.select("#yearDataset").html("");
    Object.entries(mappedData).forEach(([key, value]) => {
      select
        .append("option")
        .text(key)
        // value takes only a string, so we need to convert the object into a JSON string using JSON.stringify
        .property("value", JSON.stringify({ year: key, agency: agencyName }));
    });
    // Object.entries converts an object into an array of arrays, each array contains two items the key and the value [[key, value], [key,value], ...]
    demoInfoYear({
      year: Object.entries(mappedData)[0][0],
      agency: agencyName,
    });
  });
}

// to get the unique values for the agency
function removeDuplicate(dataList, keyword) {
  const uniqueList = [dataList[0]];
  for (let i = 1; i < dataList.length; i++) {
    let lastUniqueObj = uniqueList[uniqueList.length - 1][keyword];
    if (dataList[i][keyword] !== lastUniqueObj) {
      uniqueList.push(dataList[i]);
    }
  }
  return uniqueList;
}

//function for the agency dropdown button
function initializeAgency() {
  let select = d3.select("#agencyDataset");
  d3.json("dashboard_data.json").then((data) => {
    const uniqueData = removeDuplicate(data, "agency_name");
    uniqueData.forEach((sample) => {
      select
        .append("option")
        .text(sample["agency_name"])
        .property("value", sample["agency_name"]);
    });
    initializeYears(data[0]["agency_name"]);
  });
}

//calling the function
function optionChangedAgency(item) {
  initializeYears(item);
}
function optionChangedCounty(item) {
  // JSON.parse converts a JSON string to an object
  demoInfoYear(JSON.parse(item));
}
initializeAgency();

// {
//   2017:{income: 12123, county: "name", offenseList: [{offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}]},
//   2018:{income: 12123, county: "name", offenseList: [{offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}]},
//   2019:{income: 12123, county: "name", offenseList: [{offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}]},
//   2020:{income: 12123, county: "name", offenseList: [{offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}]}
// }
