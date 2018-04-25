const axios = require('axios');
const parseString = require('xml2js').parseString;
const cheerio = require('cheerio')

if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " keyword");
    process.exit(-1);
}
 
var keyword = process.argv[2]

// const contentItemResultMapper = (contentItem) => ({title: contentItem.title[0]})
const contentItemResultMapper = (contentItem) => ({title:contentItem.title[0], link: contentItem.link[0], pubDate: contentItem.pubDate[0], description: contentItem.description[0], content: contentItem['content:encoded'][0]})
axios.get(`https://thewirecutter.com/search/${keyword}/feed/rss2/`)
  .then(response => {
    console.log("Receive response");
    var xml = response.data;
    parseString(xml, (err, result) => {
        const contentItemResult = result.rss.channel;
        // const contentItems = contentItemResult.map(x => x.item).map((contentItem) => console.log("got item ", contentItem));
        const contentItems = contentItemResult.map(x => x.item)[0].map(contentItemResultMapper)
        const firstContentItem = contentItems[0]
        // console.dir(contentItems.length);
        // console.log("title ", firstContentItem.title[0]);
        // console.log("desc ", firstContentItem.description[0]);
        // console.log("date ", firstContentItem.pubDate[0]);
        // console.log(firstContentItem['content:encoded'][0]);
        console.log(firstContentItem);
    });
  })
  .catch(error => {
    console.log(error);
  });



//   const $ = cheerio.load('<h2 class="title">Hello world</h2>')

//   $('h2.title').text('Hello there!')
//   $('h2').addClass('welcome')

//   $.html()