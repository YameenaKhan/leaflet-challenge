//Storing our API endpoint

let URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Performing a GET request to the query URL
d3.json(URL).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  console.log(data); 
  createFeatures(data.features);
});

// Defining a feature to set colours of the markers on map according to depth of the earth
function setcolors(depth) {
  if (depth > 90){
    return "#cc3333";}

    else if (depth > 70){
      return "#cc5933";
    }

    else if (depth > 50){
      return "#cc8033";
    }

    else if (depth > 30){
      return "#cca633";
    }

    else if (depth > 10){
      return "#cccc33";
    }
    else
    {return "#80cc33";
    }
    
}

// Defining a function that we want to run once for each feature in the features array.
function createFeatures(earthquakeData) {

  // Creating circle markers with radius being propotionate to the magnitude of earthquake and color according to depth
  function pointToLayer(feature, latlng) {
    return L.circleMarker(latlng, {radius: feature.properties.mag*4,
    fillColor: setcolors(feature.geometry.coordinates[2]),
    weight: 1,
    opacity: 1,
    fillOpacity: 0.9,
    color: "black" });                
  }

  // Creating a popup at each mark that describes the place, time and magnitude of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}<p>`);
  }

  
  // Creating a GeoJSON layer that contains the features array on the earthquakeData object.
  
  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: pointToLayer,
    onEachFeature: onEachFeature
  });

    
  


  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

// Defining a function to create map with three base layers (grey-scale, street and topo), the earthquake layer and control layer
function createMap(earthquakes) {

  // Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    ,id  : "mapbox/light-v10"
  });

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  var Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
  });

  // Create a baseMaps object.
  let baseMaps = {
    
    "Street Map": street,
    "Topographic Map": topo,
    "Grey-Scale": Stadia_AlidadeSmooth
  };

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  // Set up the legend.
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    depth = [-10,10,30,50,70,90]
    colors = ["#80cc33","#cccc33","#cca633","#cc8033","#cc5933","#cc3333"]
    
    for (let i = 0; i < depth.length; i++){
        div.innerHTML +=
          '<i class="square" style="background:' + colors[i] + '"></i>' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
            }
    return div;

   
        
      };
    
  // Adding Legend to my map
  legend.addTo(myMap);
  
}

