// function to change the shape of the data from the raw format to the following format
// {
//   2017:{income: 12123, county: "name", offenseList: [{offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}]},
//   2018:{income: 12123, county: "name", offenseList: [{offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}]},
//   2019:{income: 12123, county: "name", offenseList: [{offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}]},
//   2020:{income: 12123, county: "name", offenseList: [{offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}, {offense: "", actual: 1}]}
// }
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

// Displays the county and a list of offenses based on the year selected
function demoInfoYear(yearObj) {
  d3.json("offenses.json").then((data) => {
    let result = data.filter(
      (agency) => agency["agency_name"] === yearObj.agency
    );
    const mappedData = mapOffenseToYear(result);
    // get the data of the selected year
    const filteredDataByYear = mappedData[yearObj.year];

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
        // we're saving as an object because we want to store two values to be used in other functions
        .property("value", JSON.stringify({ year: key, agency: agencyName }));
    });

    // calling these functions with an initial value object
    // without this step we'll have no charts or info for the initial starting values
    // Object.entries converts an object into an array of arrays, each array contains two items the key and the value [[key, value], [key,value], ...]
    demoInfoYear({
      year: Object.entries(mappedData)[0][0],
      agency: agencyName,
    });

    buildBarChart({
      year: Object.entries(mappedData)[0][0],
      agency: agencyName,
    });

    buildBubbleChart({
      year: Object.entries(mappedData)[0][0],
      agency: agencyName,
    });

    buildLineChart({
      year: Object.entries(mappedData)[0][0],
      agency: agencyName,
    });

    buildIncomeLineChart({
      year: Object.entries(mappedData)[0][0],
      agency: agencyName,
    });
  });
}

// removing duplicated agency name to get the unique values
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

function buildBarChart(yearObj) {
  d3.json("offenses.json").then((data) => {
    let result = data.filter(
      (agency) => agency["agency_name"] === yearObj.agency
    );
    const mappedData = mapOffenseToYear(result);
    const filteredDataByYear = mappedData[yearObj.year];

    const offenses = filteredDataByYear.offenseList.map((item) => item.offense);
    const numOfIncidents = filteredDataByYear.offenseList.map(
      (item) => item.actual
    );

    let barChart = {
      y: numOfIncidents,
      x: offenses,
      type: "bar",
      orientation: "v",
    };

    let layout = {
      title: yearObj.agency + " " + yearObj.year,
    };
    Plotly.newPlot("bar", [barChart], layout);
  });
}

function buildBubbleChart(yearObj) {
  d3.json("offenses.json").then((data) => {
    let result = data.filter(
      (agency) => agency["agency_name"] === yearObj.agency
    );
    const mappedData = mapOffenseToYear(result);
    const filteredDataByYear = mappedData[yearObj.year];

    const offenses = filteredDataByYear.offenseList.map((item) => item.offense);
    const numOfIncidents = filteredDataByYear.offenseList.map(
      (item) => item.actual
    );

    let BubbleChart = {
      y: numOfIncidents,
      x: offenses,
      mode: "markers",
      marker: {
        size: numOfIncidents,
        color: numOfIncidents,
        colorscale: "Earth",
      },
    };

    let layout = {
      title: "Bubble Chart of agency: " + yearObj.agency + " " + yearObj.year,
      hovermode: "closest",
    };

    Plotly.newPlot("bubble", [BubbleChart], layout);
  });
}

function buildLineChart(yearObj) {
  d3.json("offenses.json").then((data) => {
    let result = data.filter(
      (agency) => agency["agency_name"] === yearObj.agency
    );
    const mappedData = mapOffenseToYear(result);

    const years = Object.entries(mappedData).map(([key, value]) => key);
    const income = Object.entries(mappedData).map(
      ([key, value]) => value.income
    );
    const averageIncidentsList = Object.entries(mappedData).map(
      ([key, value]) => {
        const incidentsSum = value.offenseList.reduce(
          (total, offense) => total + offense.actual,
          0
        );
        return incidentsSum;
      }
    );

    let trace1 = {
      x: years,
      y: averageIncidentsList,
    };

    let plotData = [trace1];

    let layout = {
      title: "Incidents over years",
    };

    Plotly.newPlot("plot", plotData, layout);
  });
}

function buildIncomeLineChart(yearObj) {
  d3.json("offenses.json").then((data) => {
    let result = data.filter(
      (agency) => agency["agency_name"] === yearObj.agency
    );
    const mappedData = mapOffenseToYear(result);

    const years = Object.entries(mappedData).map(([key, value]) => key);
    const income = Object.entries(mappedData).map(
      ([key, value]) => value.income
    );

    let trace1 = {
      x: years,
      y: income,
    };

    let plotData = [trace1];

    let layout = {
      title: "Income over years",
    };

    Plotly.newPlot("line_plot", plotData, layout);
  });
}

//function for the agency dropdown button
function initializeAgency() {
  let select = d3.select("#agencyDataset");
  d3.json("offenses.json").then((data) => {
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
function optionChangedYear(item) {
  // JSON.parse converts a JSON string to an object
  demoInfoYear(JSON.parse(item));
  buildBarChart(JSON.parse(item));
  buildBubbleChart(JSON.parse(item));
  buildLineChart(JSON.parse(item));
  buildIncomeLineChart(JSON.parse(item));
}

initializeAgency();
