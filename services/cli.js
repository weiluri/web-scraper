const request = require('request')
const cheerio = require('cheerio')
const { writeJsonToFile } = require('../utils')
//const { getMovieData, retriveIdFromPath } = require("./movieData");

// Setup CLI
const initCLI = (program) => {
  program.version('0.0.1')
  program
    .option(
      '-p, --project <project>',
      'select a specific project. Example -p imdb',
    )
    .option('-u, --url <url>', 'url to the crawling site')
    .option(
      '-i, --id <id>',
      'id of movie or list of ids of movie separate by -',
    )
    .option(
      '-l, --list <id>',
      'id of list or list of ids of list separate by -',
    )
    .option('-o, --out <name>', 'output the result as <name>.json')
    .parse(process.argv)
}

const getImagesSrc = ($) => {
  //todo: Check if 404 exist

  const res = []
  const listOfImages = $('img')

  listOfImages.each((index, elem) => {
    const src = elem.attribs.src
    //console.log(srcs, 'srcs')
    res.push(src)
  })

  return res
}

const getData = (url, depth = 1) => {

  promises = []
  promises[0] = new Promise((resolve) => {

    request(url, function (error, _, html) {
      //console.error('error:', error); // Print the error if one occurred
      //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      //let results = []
      const $ = cheerio.load(html)
      const response = getImagesSrc($)
      console.log(response, 'response')

      !!response ? resolve(response) : resolve("Fail to load");

    })
  })

  return Promise.all(promises).then((value) => {
    console.log(`Done crawling ${url}...`);
    //console.log(value);
    const response = value[0].map((src) => {
      return {
        imageUrl: src,
        sourceUrl: url,
        depth: depth,
      }
    })
    return response;
  });
}

// Process CLI
const processCLI = async (program) => {
  
  const res = await getData(program.url)

  console.log(res, 'resssssssssssss')

  const outputName = program.out;
  outputName ? writeJsonToFile(res, outputName) : console.log(res)
}

module.exports = {
  initCLI,
  processCLI,
}
