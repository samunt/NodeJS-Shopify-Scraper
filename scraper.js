const cheerio = require("cheerio");
const axios = require("axios");
const admin = require("firebase-admin");
const date = new Date();

let pageNum = 0;
let siteUrl = "https://ocs.ca/collections/all-cannabis-products?&page=" + pageNum + "&viewAll=true";
let productArray = [];
let vendor = [];
let productTitle = [];
let plantType = [];
let thcRange = [];
let cbdRange = [];
let productType = [];
let price = [];
let totalNumberOfPages = 1;

// called by getResults()
const fetchData = async () => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

// sleep function so we don't make requests to quickly
function sleep(ms){
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
}

// get random number for sleep timer
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// this function is called from index.js
const getResults = async () => {
  // Get a database reference to our blog
  let db = admin.database();
  let ref = db.ref("scrapedPages/");
  do {
    const $ = await fetchData();
    let productTitleName = ""; // product title name to check against later one

    // first check how many total pages there are
    totalNumberOfPages = parseInt($('.pagination li:nth-last-child(2)').text());

    // use fetched data to grab elements (and their text) and push into arrays defined above
    $('.product-tile__vendor').each((index, element) => {
      vendor.push($(element).text());
    });

    $('.product-tile__title').each((index, element) => {
      productTitle.push($(element).text());
    });

    $('.product-tile__plant-type').each((index, element) => {
      plantType.push($(element).text());
    });

    $('.product-tile__properties  li:nth-child(2) p').each((index, element) => {
      thcRange.push($(element).text());
    });

    $('.product-tile__properties  li:nth-child(3) p').each((index, element) => {
      cbdRange.push($(element).text());
    });

    $('.product-tile__price').each((index, element) => {
      let elTxt = $(element).text()
      let productTitleName = productTitle[index];
      // figure out what type of product
      // How to figure out what the product is
      // IF
      // OIL => price == per bottle && name !HAS "spray"
      // SPRAY => price == per bottle && name HAS "spray"
      // DRY BUD => price == per gram
      // PRE-ROLL => price == per pack
      // CAPSULE => price == per bottle && name HAS "gels" or "capsules"
      if (elTxt.includes("bottle") && !productTitleName.includes("spray")) {
        productType.push('Oil');
      } else if (elTxt.includes("bottle") && productTitleName.includes("spray")) {
        productType.push('Spray');
      } else if (elTxt.includes("/ g")) {
        productType.push("Dry Bud");
      } else if (elTxt.includes("pack")) {
        productType.push("Pre rolls");
      } else if ((elTxt.includes("bottle") && productTitleName.includes("gel")) || (elTxt.includes("bottle") && productTitleName.includes("capsule"))) {
        productType.push("Softget/Capsule");
      }
    });

    // increment page number to get more products if the page count is less than total number of pages
    if (pageNum < totalNumberOfPages) {
      pageNum ++;
    };
    console.log(pageNum)
    //Convert to an array so that we can sort the results.
    // we need the IF because when you click to go to the next page, it just appends the product list with new data
    // so that means that the last page will have all the data, only if we went thru the pages from 1 .. n, one at a time
    if (totalNumberOfPages == pageNum) {
      productArray.push ({
        productType: [...productType],
        vendors: [...vendor],
        productTitle: [...productTitle],
        plantType: [...plantType],
        thcRange: [...thcRange],
        cbdRange: [...cbdRange],
        price: [...price],
        date
      });

    }
    await sleep(getRandomInt(5000, 20000));
  } while (totalNumberOfPages > pageNum);

  let dateToString = date.toString();
  let pageRef = ref.child(dateToString);
  pageRef.set(productArray);
  console.log(pageRef);
  return productArray;
};

module.exports = getResults;

