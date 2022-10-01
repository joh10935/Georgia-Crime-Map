// Location Coordinates
// organize code
// cloropeth based on income
// markers for agencies with popups


var myMap = L.map("map", {
  center: [32.8407, -83.6324],
  zoom: 8,
});

function createMap(county) {
  // Create the base layers.
  var street = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',}
  );

  //terrain layer
  var terrain = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {attribution:"Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",}
  );

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": terrain,
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Counties: county,
    Departments: loclayer,
  };

  var legend = L.control(
    {
      position: "bottomright"
    }
  )

  legend.onAdd = function()
  {
      var div = L.DomUtil.create("div", "info legend");
      // console.log(div)

      var intervals = [0, 37500, 55000, 70000];

      var colors = [
          '#FF0000',
          '#ff4500',
          '#00FFFF',
          '#008000'
      ]

      for(var i=0; i<intervals.length; i++)
      {
          div.innerHTML += "<i style='background: " + colors[i] + "'></i>" 
          + '$' + intervals[i] + (intervals[i+1]  ? ' &ndash; ' + intervals[i+1] + ' <br>': '+')
      }
      return div;
  }
  legend.addTo(myMap)

  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(myMap);
}

d3.json("data/Ga_Department_Locations.json").then(function (countydata) {
  {
    locations = [];

    for (i = 0; i < countydata.length; i++) {
      lat = countydata[i].Latitude;
      lng = countydata[i].Longitude;
      Income = countydata[i]["2020 Income per Capita"];

      locArea = L.marker([lat, lng]).bindPopup(
        `<h2> ${countydata[i]["Agency Name"]}</h2>`
      );

      locations.push(locArea);
    }
    // L.heatLayer(lat)
    loclayer = L.layerGroup(locations);
  }

  d3.json("data/ID_capita.json").then(function (income) {
    ctycolor = [];
    combined = [];

    for (i = 0; i < income.length; i++) {
      var countycolor;

      if (income[i]["2020 Income per Capita"] > 70000) 
        countycolor = "#008000";
      else if (income[i]["2020 Income per Capita"] > 55000)
        countycolor = "#00FFFF";
      else if (income[i]["2020 Income per Capita"] > 37500)
        countycolor = "#ff4500";
      else 
        countycolor = "#FF0000";

      var cty = income[i]["County"];

      cty = _.toUpper(cty);
      x = { cty, countycolor };
      combined.push(x);
    }

    d3.json("data/GA-13-georgia-counties.json").then(function (data) {
      var geojson = topojson.feature(
        data,
        data.objects.cb_2015_georgia_county_20m
      ).features;

      console.log(combined);
      var county = L.geoJson(geojson, {
        style: function (Feature) {
          if (_.findIndex(combined, {cty: _.toUpper(Feature.properties.NAME) + " COUNTY",}) >= 0) {
            return {
              color: "black",
              fillColor:
                combined[_.findIndex(combined, {cty: _.toUpper(Feature.properties.NAME) + " COUNTY",})].countycolor,
              fillOpacity: 0.3,
              weight: 2,
            };
          } else
            return {
              color: "black",
              fillColor: "white",
              fillOpacity: 0.3,
              weight: 2,
            };
        },
        onEachFeature: function (Feature, layer) {
          layer.on({
            mouseover: function (event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.85,
              });
            },

            mouseout: function (event) {
              layer = event.target;
              layer.setStyle({
                fillOpacity: 0.3,
              });
            },

            click: function (event) {
              layer = event.target;
              myMap.fitBounds(layer.getBounds());
            },
          });

          layer.bindPopup(`${Feature.properties.NAME} County <hr> `);
          
        },
      });

      createMap(county);
    });
  });
});
