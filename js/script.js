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
var center = []
var pt1;


/**************************************/
// Style function to color the areas  //
/**************************************/

// function style_landkreis(feature) {
//   console.log("Looking for shape for: " + landkreis)
//  if ((landkreis.includes(feature.properties.GEN) || feature.properties.GEN.includes(landkreis) || feature.properties.GEN === landkreis) && (feature.properties.BEZ === "Landkreis" || feature.properties.BEZ === "Kreis")) {
//   console.log(feature.properties.GEN)
//    return {
//      weight: 2,
//      opacity: 1,
//      color: 'white',       
//      fillOpacity: 0.3,
//      fillColor: '#32a852'
//    };
//  } else {
//    return {
//      weight: 2,
//      opacity: 1,
//      color: 'white',      
//      fillOpacity: 0.3,
//      fillColor: '#a83248'
//    };
//  }
// }

// function style_kreisfreie_stadt(feature) {
//   // console.log(pt1)
//   // console.log(feature.geometry)
//   // console.log(turf.booleanPointInPolygon(pt1, feature.geometry))
//  // if ((landkreis.includes(feature.properties.GEN) || feature.properties.GEN.includes(landkreis) || feature.properties.GEN === landkreis) && feature.properties.BEZ === "Kreisfreie Stadt") {
//  if (turf.booleanPointInPolygon(pt1, feature.geometry)) { 
//   console.log("found it")
//    return {
//      weight: 2,
//      opacity: 1,
//      color: 'white',       
//      fillOpacity: 0.3,
//      fillColor: '#32a852'
//    };
//  } else {
//    return {
//      weight: 2,
//      opacity: 1,
//      color: 'white',      
//      fillOpacity: 0.3,
//      fillColor: '#a83248'
//    };
//  }
// }

function style_kreis(feature) {
  // console.log(pt1)
  // console.log(feature.geometry)
  // console.log(turf.booleanPointInPolygon(pt1, feature.geometry))
  if (pt1) {
    if (turf.booleanPointInPolygon(pt1, feature.geometry)) { 
      console.log("found it")
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
  } else {
  console.log("pt1 has not yet been asigned")
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

var geojsonLayer = new L.GeoJSON.AJAX("data/kreisgrenzen19_de.geojson", {
  style: style_kreis
});

// Callback for when geojson is finished loading
geojsonLayer.on('data:loaded', function() { 

  geojsonLayer.addTo(mymap);
  map_loaded = true;

  $("#modal").addClass("hidden");

})



// function loadMap(stadt_typ) {
//   if (map_loaded === true) {
//     geojsonLayer.setStyle(style)
//   }

// }

// function myFunction() {
//   if (map_loaded === true && csv_loaded === true) {
//     var text_field_value = document.getElementById("myText").value;
//     zip = text_field_value;

//     csv_data.forEach(function(entry) {
//       if (entry.plz === text_field_value) {
//         if (entry.landkreis) {
//           console.log("Es is ein Landkreis")
//           landkreis = entry.landkreis;
//           geojsonLayer.setStyle(style_landkreis)

//           console.log("OSMID: " + entry.osm_id)

//           // we are using Nominatim service
//           var geocode = 'https://nominatim.openstreetmap.org/details.php?osmtype=R&osmid=' + entry.osm_id + '&format=json'

//           // use jQuery to call the API and get the JSON results
//           $.getJSON(geocode, function(data) {
//             // get coordiantes from osmid
//             center_point = [data.centroid.coordinates[1], data.centroid.coordinates[0]]

//             console.log(center_point)
//             // mymap.setView([lon, lat], 10);
//           }).done(function() {
//            mymap.setView(center_point, 10);
//          });


//         } else if (entry.ort) {
//           console.log("Es is eine kreisfreie Stadt")
//           landkreis = entry.ort;
//           geojsonLayer.setStyle(style_kreisfreie_stadt)

//           console.log("OSMID: " + entry.osm_id)


//           // we are using Nominatim service
//           var geocode = 'https://nominatim.openstreetmap.org/details.php?osmtype=R&osmid=' + entry.osm_id + '&format=json'

//           // use jQuery to call the API and get the JSON results
//           $.getJSON(geocode, function(data) {
//           // get coordiantes from osmid
//           center_point = [data.centroid.coordinates[1], data.centroid.coordinates[0]]

//           console.log(center_point)
//             // mymap.setView([lon, lat], 10);
//           }).done(function() {
//             mymap.setView(center_point, 10);
//           });

//         }

//       }

//     });


//   }
// }

function myFunction() {
  if (map_loaded === true) {
    var text_field_value = document.getElementById("myText").value;
    zip = text_field_value;

    var geocode = 'https://nominatim.openstreetmap.org/search?postalcode=' + zip + '&country=Germany&format=json'
    console.log("Clicked the button, let's go!")
    // use jQuery to call the API and get the JSON results
    $.getJSON(geocode).done(function(data) {
      try {
        console.log(data)
        // get coordiantes from zip code
        center = [Number(data[0].lon), Number(data[0].lat)]
        console.log(center)

        pt1 = {
          "type": "Feature",
          "properties": {
            "marker-color": "#f00"
          },
          "geometry": {
            "type": "Point",
            "coordinates": center
          }
        };

        // console.log(pt1)

        geojsonLayer.setStyle(style_kreis)
        mymap.setView([center[1], center[0]], 11);
        $("#content").removeClass("hidden");
        mymap.invalidateSize()
      } catch (e) {
        console.log(e)
        document.getElementById("myText").value = "Bitte geben sie eine exisiterende PLZ ein"
      }
    });
  }
}


/**********************/
// Load csv data      //
/**********************/

// Papa.parse("data/zuordnung_plz_ort_landkreis.csv", {
//   download: true,
//   header: true,
//   complete: function(results) {
//     csv_data = results.data
//     csv_loaded = true;
//   }
// });

// function get_center_point(osmid) {

//   // we are using Nominatim service
//   var geocode = 'https://nominatim.openstreetmap.org/details.php?osmtype=R&osmid=62559&format=json'

//   // use jQuery to call the API and get the JSON results
//   $.getJSON(geocode, function(data) {
//     // get coordiantes from osmid
//     center_point = [data.centroid.coordinates[1], data.centroid.coordinates[0]]

//     console.log(center_point)
//     // mymap.setView([lon, lat], 10);
//   }).done(function() {
//     return center_point
//   });
// }

// /*************************************/
// // Find Coordiantes by zip code      //
// /********************************** **/

// // we are using Nominatim service
//   var geocode = 'https://nominatim.openstreetmap.org/search?postalcode=28757&country=Germany&format=json'
//   // use jQuery to call the API and get the JSON results
//   $.getJSON(geocode, function(data) {
//     // get coordiantes from osmid
//     console.log(data[0])
//     console.log(data[0].lat)
//     console.log(data[0].lon)
//     center = [Number(data[0].lat), Number(data[0].lon)]
//     console.log(center)
//     // mymap.setView([lon, lat], 10);
//   }).done(function() {
//     // return center_point

//   var pt1 = {
//   "type": "Feature",
//   "properties": {
//     "marker-color": "#f00"
//   },
//   "geometry": {
//     "type": "Point",
//     "coordinates": center
//   }
// };

// console.log(pt1)




//   });


