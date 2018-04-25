const axios = require('axios');
const parseString = require('xml2js').parseString;


if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " keyword");
    process.exit(-1);
}
 
var keyword = process.argv[2]

axios.get(`https://thewirecutter.com/search/${keyword}/feed/rss2/`)
  .then(response => {
    console.log("Receive response");
    var xml = response.data;
    parseString(xml, function (err, result) {
        console.dir(result.rss.channel[0].item[0]);
    });

    
  })
  .catch(error => {
    console.log(error);
  });