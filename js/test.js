/**********************************************/
// Load the Map and do all the leaflet stuff  //
/**********************************************/

var mymap = L.map('mapid').setView([53, 8.8], 10);

const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const tileURL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileURL, {attribution});

// Add OSM tiles to the map
tiles.addTo(mymap);


/*****************************/
// Initialize all variables  //
/*****************************/

var zip = "asdfsfasdf";
var landkreis = "asfdsfas";
var map_loaded = false;
var csv_loaded = false;
var csv_data;
var center_point = [];


/**************************************/
// Style function to color the areas  //
/**************************************/

function style_landkreis(feature) {

 if ((landkreis.includes(feature.properties.GEN) || feature.properties.GEN.includes(landkreis)) && feature.properties.BEZ === "Landkreis") {
   return {
     weight: 2,
     opacity: 1,
     color: 'white',       
     fillOpacity: 0.3,
     fillColor: '#32a852'
   };
 } else {
   return {
     weight: 2,
     opacity: 1,
     color: 'white',      
     fillOpacity: 0.3,
     fillColor: '#a83248'
   };
 }
}

function style_kreisfreie_stadt(feature) {

 if ((landkreis.includes(feature.properties.GEN) || feature.properties.GEN.includes(landkreis)) && feature.properties.BEZ === "Kreisfreie Stadt") {
   return {
     weight: 2,
     opacity: 1,
     color: 'white',       
     fillOpacity: 0.3,
     fillColor: '#32a852'
   };
 } else {
   return {
     weight: 2,
     opacity: 1,
     color: 'white',      
     fillOpacity: 0.3,
     fillColor: '#a83248'
   };
 }
}


/**********************/
// Load geojson data  //
/**********************/

var geojsonLayer = new L.GeoJSON.AJAX("../data/shape_de.geojson", {
  style: style_landkreis
});

// Callback for when geojson is finished loading
geojsonLayer.on('data:loaded', function() { 

  geojsonLayer.addTo(mymap);
  map_loaded = true;

  $("#modal").addClass("hidden");
  $("#content").removeClass("hidden");

})



// function loadMap(stadt_typ) {
//   if (map_loaded === true) {
//     geojsonLayer.setStyle(style)
//   }

// }

function myFunction() {
  if (map_loaded === true && csv_loaded === true) {
    var text_field_value = document.getElementById("myText").value;
    zip = text_field_value;

    csv_data.forEach(function(entry) {
      if (entry.plz === text_field_value) {
        if (entry.landkreis) {
          console.log("Es is ein Landkreis")
          landkreis = entry.landkreis;
          geojsonLayer.setStyle(style_landkreis)

          console.log("OSMID: " + entry.osm_id)

          // we are using Nominatim service
          var geocode = 'https://nominatim.openstreetmap.org/details.php?osmtype=R&osmid=' + entry.osm_id + '&format=json'

          // use jQuery to call the API and get the JSON results
          $.getJSON(geocode, function(data) {
            // get coordiantes from osmid
            center_point = [data.centroid.coordinates[1], data.centroid.coordinates[0]]

            console.log(center_point)
            // mymap.setView([lon, lat], 10);
          }).done(function() {
           mymap.setView(center_point, 10);
         });

        
        } else if (entry.ort) {
          console.log("Es is eine kreisfreie Stadt")
          landkreis = entry.ort;
          geojsonLayer.setStyle(style_kreisfreie_stadt)

          console.log("OSMID: " + entry.osm_id)


          // we are using Nominatim service
          var geocode = 'https://nominatim.openstreetmap.org/details.php?osmtype=R&osmid=' + entry.osm_id + '&format=json'

          // use jQuery to call the API and get the JSON results
          $.getJSON(geocode, function(data) {
          // get coordiantes from osmid
          center_point = [data.centroid.coordinates[1], data.centroid.coordinates[0]]

          console.log(center_point)
            // mymap.setView([lon, lat], 10);
          }).done(function() {
            mymap.setView(center_point, 10);
          });

        }

      }

    });


  }
}


/**********************/
// Load csv data      //
/**********************/

Papa.parse("data/zuordnung_plz_ort_landkreis.csv", {
  download: true,
  header: true,
  complete: function(results) {
    csv_data = results.data
    csv_loaded = true;
  }
});






// // we are using MapQuest's Nominatim service
// var geocode = 'https://nominatim.openstreetmap.org/search?q=Bremen,Germany&format=json&polygon=1&addressdetails=1'

// // use jQuery to call the API and get the JSON results
// $.getJSON(geocode, function(data) {
//   // get lat + lon from first match
//   var latlng = [data[0].lat, data[0].lon]
//   console.log(latlng);

//   // let's stringify it
//   var latlngAsString = latlng.join(',');
//   console.log(latlngAsString);
//   center_point = latlng

//   // the full results JSON
//   console.log(data);
// }).done(function() {
//     console.log( " success" );
//   });

function get_center_point(osmid) {

  // we are using Nominatim service
  var geocode = 'https://nominatim.openstreetmap.org/details.php?osmtype=R&osmid=62559&format=json'

  // use jQuery to call the API and get the JSON results
  $.getJSON(geocode, function(data) {
    // get coordiantes from osmid
    center_point = [data.centroid.coordinates[1], data.centroid.coordinates[0]]

    console.log(center_point)
    // mymap.setView([lon, lat], 10);
  }).done(function() {
    return center_point
  });
}

