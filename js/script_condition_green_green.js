/**********************************************/
// Load the Map and do all the leaflet stuff  //
/**********************************************/

var mymap = L.map('mapid', { zoomControl: false }).setView([53, 8.8], 10);

const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const tileURL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const tiles = L.tileLayer(tileURL, {attribution});

// Add OSM tiles to the map
tiles.addTo(mymap);

//Disable map interaction
mymap.dragging.disable();
mymap.touchZoom.disable();
mymap.doubleClickZoom.disable();
mymap.scrollWheelZoom.disable();
mymap.boxZoom.disable();
mymap.keyboard.disable();
if (mymap.tap) mymap.tap.disable();


/*****************************/
// Initialize all variables  //
/*****************************/

var zip = "default";
var landkreis = "";
var map_loaded = false;
var csv_loaded = false;
var csv_data;
var center_point = [];
var center = []
var pt1;
document.getElementById("myText").value = ""; //Reset inputfield on reload


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
       fillColor: '#32a852'
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
  activateUI()
})

/**********************/
// Load csv data      //
/**********************/

Papa.parse("data/plz_kreis_centroid_new.csv", {
  download: true,
  header: true,
  complete: function(results) {
    csv_data = results.data
    csv_loaded = true;
    activateUI()
  }
});

function activateUI() {
  if (map_loaded && csv_loaded) {
    $("#modal").addClass("hidden");
  }
}


// function myFunction() {
//   if (map_loaded === true) {
//     var text_field_value = document.getElementById("myText").value;

//     console.log("Text Value: " + text_field_value)

//     if (text_field_value) {
//       zip = text_field_value;
//     } else {
//       zip = "error";
//     }

//     var geocode = 'https://nominatim.openstreetmap.org/search?postalcode=' + zip + '&country=Germany&format=json'


//     console.log("Clicked the button, let's go!")
//     console.log('https://nominatim.openstreetmap.org/search?postalcode=' + zip + '&country=Germany&format=json')
//     // use jQuery to call the API and get the JSON results
//     $.getJSON(geocode).done(function(data) {
//       try {
//         console.log(data)
//         // get coordiantes from zip code
//         center = [Number(data[0].lon), Number(data[0].lat)]
//         console.log(center)

//         pt1 = {
//           "type": "Feature",
//           "properties": {
//             "marker-color": "#f00"
//           },
//           "geometry": {
//             "type": "Point",
//             "coordinates": center
//           }
//         };

//         // console.log(pt1)

//         geojsonLayer.setStyle(style_kreis)
//         mymap.setView([center[1], center[0]], 11);
//         $("#content").removeClass("hidden");
//         mymap.invalidateSize()

//         //if succesfully load data, change input field to correct
//         $("#myText").removeClass("input-error");
//         $("#myText").addClass("input-correct");
//       } catch (e) {
//         console.log(e)
//         $("#myText").val("");
//         $("#myText").attr("placeholder", "Bitte geben Sie eine gültige PLZ ein");
//         $("#myText").removeClass("input-correct");
//         $("#myText").addClass("input-error");
//       }
//     });
//   }
// }

function myFunction() {
  var kreis_found = false;
  if (map_loaded && csv_loaded) {
    var text_field_value = document.getElementById("myText").value;

    console.log("Text Value: " + text_field_value)

    if (text_field_value) {
      zip = text_field_value;
    } else {
      zip = "error";
    }

    csv_data.forEach((entry) => {
      if (zip === entry.plz) {
        kreis_found = true;
        center = [Number(entry.lon), Number(entry.lat)]
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

        geojsonLayer.setStyle(style_kreis)
        zoomLevel = 0;
                //set zoom level
        var width = document.documentElement.clientWidth;
            // tablets are between 768 and 922 pixels wide
            // phones are less than 768 pixels wide
        if (width > 768) {
            zoomLevel = 11;
            console.log("Zoom level: 11")
        }  else {
            zoomLevel = 10;
            console.log("Zoom level: 10")
        }

        mymap.setView([center[1], center[0]], zoomLevel);
        $("#content").removeClass("hidden");
        mymap.invalidateSize()

        //if succesfully load data, change input field to correct
        $("#myText").removeClass("input-error");
        $("#myText").addClass("input-correct");
      } 
    });

    // Wenn kein Kreis gefunden wurde
    if (!kreis_found) {
      console.log("Kein Kreis gefunden")
      $("#myText").val("");
      $("#myText").attr("placeholder", "Bitte geben Sie eine gültige PLZ ein");
      $("#myText").removeClass("input-correct");
      $("#myText").addClass("input-error");
    }
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


