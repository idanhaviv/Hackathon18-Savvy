const axios = require("axios");
const parseString = require("xml2js").parseString;
const cheerio = require("cheerio");
var Db = require('mongodb').Db,
  MongoClient = require('mongodb').MongoClient,
  Server = require('mongodb').Server,
  ReplSetServers = require('mongodb').ReplSetServers,
  ObjectID = require('mongodb').ObjectID,
  Binary = require('mongodb').Binary,
  GridStore = require('mongodb').GridStore,
  Grid = require('mongodb').Grid,
  Code = require('mongodb').Code,
  assert = require('assert');

if (process.argv.length <= 2) {
  console.log("Usage: " + __filename + " keyword");
  process.exit(-1);
}

var tags = process.argv.slice(2);
console.log('input tags: ', tags);

var keyword = process.argv[2];

const imgUrlExtractor = descriptionTag => {
  const $ = cheerio.load(descriptionTag);
  return $("img[class=image]").attr("src");
};

const contentItemResultMapper = contentItem => ({
  title: contentItem.title[0],
  link: contentItem.link[0],
  pubDate: contentItem.pubDate[0],
  description: contentItem.description[0],
  content: contentItem["content:encoded"][0],
  imgUrl: imgUrlExtractor(contentItem.description[0])
});
axios
  .get(`https://thewirecutter.com/search/${keyword}/feed/rss2/`)
  .then(response => {
    var xml = response.data;
    parseString(xml, (err, result) => {
      const contentItemResult = result.rss.channel;
      const contentItems = contentItemResult
        .map(x => x.item)[0]
        .map(contentItemResultMapper);

      const mongoclient = MongoClient.connect("mongodb://savvy:savvy123@ds155299.mlab.com:55299/soluto-savvy", (err, client) => {
        assert.equal(null, err);
        const db = client.db('soluto-savvy')
        contentItems.map((contentItem, index, contentItems) => {

          db.collection('posts').update({link:contentItem.link}, { ...contentItem, tags}, {upsert:true}, function(err, result) {
            console.log("err ", err)
            
            if (index == contentItems.length - 1) {
              client.close();
            }
          });
        })
      })
    });
  })
  .catch(error => {
    console.log(error);
  });
  


  // var mongoclient = MongoClient.connect("mongodb://localhost:27017/local", (err, client) => {
