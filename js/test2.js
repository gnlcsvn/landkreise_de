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

var zip = "default";
var landkreis = "";
var map_loaded = false;
var csv_loaded = false;
var csv_data;
var center_point = [];
var center = []
var pt1;
var area;
var geojson_counter = 0;
var found_polygon = false;
var has_area = false;


/**************************************/
// Style function to color the areas  //
/**************************************/

function style_kreis(feature) {

  if (pt1) {
    if (turf.booleanPointInPolygon(pt1, feature.geometry)) { 
      // console.log("found it")
      found_polygon = true;
      area = Number(feature.properties.SHAPE_Area);
      if (area > 1) {
        has_area = true;
      }
    } else {

    }
  } else {
    console.log("pt1 has not yet been asigned")
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

Papa.parse("data/plz_kreis_centroid_test.csv", {
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

function mean(numbers) {
    var total = 0, i;
    for (i = 0; i < numbers.length; i += 1) {
        total += numbers[i];
    }
    return total / numbers.length;
} 

function median(numbers) {
    // median of [3, 5, 4, 4, 1, 1, 2, 3] = 3
    var median = 0, numsLen = numbers.length;
    numbers.sort();
 
    if (
        numsLen % 2 === 0 // is even
    ) {
        // average of two middle numbers
        median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
    } else { // is odd
        // middle number only
        median = numbers[(numsLen - 1) / 2];
    }
 
    return median;
}

function myFunction() {

  var array_area = [];

    csv_data.forEach((entry) => {

        center = [Number(entry.lon), Number(entry.lat)]

        console.log("lol")

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

        found_polygon = false;
        has_area = false;
        geojsonLayer.setStyle(style_kreis)

        if (found_polygon === false) {
          console.log("No polygon for zip: " + entry.plz)
          console.log("At gps: " + center)
        }

        if (has_area === false) {
          console.log("No area for zip: " + entry.plz)
          console.log("At gps: " + center)
        } else {
          array_area.push(area)
        }

        // console.log(found_polygon)
        mymap.setView([center[1], center[0]], 11);
        $("#content").removeClass("hidden");
        mymap.invalidateSize()

        //if succesfully load data, change input field to correct
        $("#myText").removeClass("input-error");
        $("#myText").addClass("input-correct");
    });

    console.log(array_area);
    console.log("Mean: " + mean(array_area)); //2742458185.4350433
    console.log("Median: " + median(array_area)); //2776564047.729329
}


