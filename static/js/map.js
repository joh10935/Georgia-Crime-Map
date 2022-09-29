// Location Coordinates
// organize code
// cloropeth based on income
// markers for agencies with popups
// poor < 32000
// lower middle < 54000
// middle < 107000
// Upper middle < 374000
// rich > 374000

var myMap = L.map("map", {
    center: [32.8407, -83.6324],
    zoom: 8
  });


function createMap(county) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    "Counties": county,
    "Departments": loclayer
  };


  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}




d3.json('data/GA_Counties_Income_Data.json').then(
  function(countydata)    
  {  
    locations=[]

    for(i=0; i<countydata.length; i++)
    {
      lat = countydata[i].Latitude
      lng = countydata[i].Longitude



      // locations.push(L.marker([lat, lng])).addTo(myMap)
      
      locArea = L.marker([lat, lng]).bindPopup(
        `<h2> ${countydata[i]["Agency Name"]}</h2>`)
      
      locations.push(locArea)
    }    
    
    loclayer = L.layerGroup(locations)

  
  } 
)


d3.json('GA-13-georgia-counties.json').then(
    function(data){
        
       
        var geojson = topojson.feature(data, data.objects.cb_2015_georgia_county_20m).features
       
        var county = L.geoJson(geojson, {
            style: function(Feature)
            {
                return {
                    color: 'black',
                    fillColor: 'white',
                    fillOpacity: .3,
                    weight: 2
                }
            },
            onEachFeature: function(Feature, layer)
            {
              layer.on({
                mouseover: function(event)
                {
                  layer = event.target;
                  layer.setStyle({
                    fillOpacity: .85
                  })
                },
        
                mouseout: function(event)
                {
                  layer = event.target;
                  layer.setStyle({
                    fillOpacity: .3
                  })
                },
        
                click: function(event)
                {
                  layer = event.target;
                  myMap.fitBounds(layer.getBounds());
                }
              });
        
            layer.bindPopup(`${Feature.properties.NAME} County`)
            }
        })


        createMap(county)
    }
)



