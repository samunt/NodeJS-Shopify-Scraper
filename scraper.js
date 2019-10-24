const cheerio = require("cheerio");
const axios = require("axios");
const admin = require("firebase-admin");
const date = new Date();

let pageNum = 1;
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
  let url = "https://ocs.ca/collections/all-cannabis-products?&page=" + pageNum
  const result = await axios.get(url);
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

// this function is called first
const getResults = async () => {
  // Get a database reference to our blog
  let db = admin.database();
  // create db path reference
  let ref = db.ref("scrapedPages/");
  let dateToString = date.toString();
  // prep db references by adding a timestamp
  let pageRefBestSellers = ref.child('OCS-best-sellers-on-' + dateToString);
  let pageRef = ref.child('OCS-full-product-listing-scrape-on-' + dateToString);
  // best sellers stuff
  let bestSellersArray = [];
  let bestSellersVendor = [];
  let bestSellersTitle = [];
  let bestSellersPlantType = [];
  let bestSellersTHCrange = [];
  let bestSellersCBDrange = [];
  let bestSellersPrice = [];

  do {
    const $ = await fetchData();
    // only grab the best sellers data once.
    if (pageNum == 2) {
      let refToTopSellers = $('.slick-slide');
      // get top seller list
      refToTopSellers.each((index, element) => {
        bestSellersVendor.push($('.product-tile__info .product-tile__vendor', element).text());
        bestSellersTitle.push($(' .product-tile__info .product-tile__title', element).text());
        bestSellersPlantType.push($('.product-tile__info .product-tile__plant-type p', element).text());
        bestSellersTHCrange.push($('.product-tile__properties li:nth-child(2) p', element).text());
        bestSellersCBDrange.push($('.product-tile__properties li:nth-child(3) p', element).text());
        bestSellersPrice.push($('product-tile__price', element).text());
      });
      // once done iterating through the best sellers, prep to send to db
      bestSellersArray.push ({
        vendors: [...bestSellersVendor],
        productTitle: [...bestSellersTitle],
        plantType: [...bestSellersPlantType],
        thcRange: [...bestSellersTHCrange],
        cbdRange: [...bestSellersCBDrange],
        price: [...bestSellersPrice],
        date
      });
    }
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
      price.push($(element).text());
    });

    // increment page number to get more products if the page count is less than total number of pages
    if (pageNum <= totalNumberOfPages) {
      pageNum ++;
    };
    console.log(pageNum)
    //Convert to an array so that we can sort the results.
    // we need the IF because when you click to go to the next page, it just appends the product list with new data
    // so that means that the last page will have all the data, only if we went thru the pages from 1 .. n, one at a time
    if (totalNumberOfPages == pageNum) {
      productArray.push ({
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
  // send data to DB
  pageRef.set(productArray);
  pageRefBestSellers.set(bestSellersArray);
  console.log('arr', bestSellersArray);

  return productArray;
};

module.exports = getResults;

// figure out what type of product
// How to figure out what the product is
// OIL => price == per bottle && name !HAS "spray"
// DRY BUD => price == per gram
// PRE-ROLL => price == per pack
// CAPSULE => price == per bottle && name HAS "gels" or "capsules"
