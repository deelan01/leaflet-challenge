let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
let map = L.map('map').setView([39.8283, -98.5795], 4);
function createMap(earthquakeLayer) {
  
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  

    let baseMaps = {
        "Street Map": streetmap
    };

    
    let overlayMaps = {
        "Earthquakes": earthquakeLayer
    };
   
    map.addLayer(streetmap);
    map.addLayer(earthquakeLayer);

  
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
}

d3.json(geoData).then(function(data) {
   
    let earthquakeLayer = L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            let magnitude = feature.properties.mag;
            let depth = feature.geometry.coordinates[2]; 
            let color = getColor(depth); 

        
            return L.circleMarker(latlng, {
                radius: magnitude * 4, 
                fillColor: color,
                color: "black", 
                weight: 1,
                fillOpacity: 0.7
            });
        },
        onEachFeature: function (feature, layer) {
    
            layer.bindPopup(`
                <h3>Magnitude: ${feature.properties.mag}</h3>
                <p>Depth: ${feature.geometry.coordinates[2]} km</p>
                <p>${feature.properties.place}</p>
                <p>Time: ${new Date(feature.properties.time).toLocaleString()}</p>
            `);
        }
    });

   
    createMap(earthquakeLayer);
}).catch(function(error) {
    console.error('Error loading the earthquake data:', error);
});


function getColor(depth) {
    if (depth >= 700) return "red"; 
    else if (depth >= 300) return "orange"; 
    else if (depth >= 100) return "yellow"; 
    else return "green"; 
}