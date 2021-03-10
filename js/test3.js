/**********************/
// Load csv data      //
/**********************/

var csv_data;
var zip_code_out = ""
var center_out = ""

Papa.parse("data/postleitzahlengebiete.csv", {
  download: true,
  header: true,
  complete: function(results) {
    csv_data = results.data
    csv_loaded = true;

    csv_data.forEach((entry, i) => {
      console.log(entry.plz)
      // setTimeout(() => {
      //   // console.log(entry.plz)
      //   zip_code_out = entry.plz

      //   // test(entry.plz)
      // }, 1500 * i);
    });

    // csv_data.forEach(function(entry) {
    //   setTimeout(() => {
    //     console.log(entry.plz)
    //   }, 1000);
      
    // });
  }
});





function test(zipCode) {

  // console.log("This is a test!")

  var zip = zipCode

  var testcode = 'https://nominatim.openstreetmap.org/search?postalcode=' + zip + '&country=Germany&format=json'

  // console.log('https://nominatim.openstreetmap.org/search?postalcode=' + zip + '&country=Germany&format=json')
  // use jQuery to call the API and get the JSON results
  $.getJSON(testcode).done(function(data) {
    try {
      // console.log(data)
      // get coordiantes from zip code
      center = [Number(data[0].lon), Number(data[0].lat)]
      center_out = center
      console.log(zip_code_out + "," + data[0].lon + "," + data[0].lat)
      // console.log(center)
    }catch (e) {
      console.log(e)
      console.log("No result for: " + zip_code_out)
    }
  });
}

// test()

