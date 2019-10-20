const cheerio = require("cheerio");
const axios = require("axios");
let pageNum = 0;
let siteUrl = "https://ocs.ca/collections/all-cannabis-products?&page=" + pageNum + "&viewAll=true";
let productArray = [];
let vendor = [];
let productTitle = [];
let plantType = [];
let thcRange = [];
let cbdRange = [];
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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// this function is called from index.js
const getResults = async () => {
  do {
    const $ = await fetchData();

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
    if (pageNum < totalNumberOfPages) {
      pageNum ++;
    };

    //Convert to an array so that we can sort the results.
    productArray.push ({
      vendors: [...vendor],
      productTitle: [...productTitle],
      plantType: [...plantType],
      thcRange: [...thcRange],
      cbdRange: [...cbdRange],
      price: [...price],
      pageNum
    });
    console.log(totalNumberOfPages)
    console.log(pageNum)
    await sleep(getRandomInt(5000, 20000));
  } while (totalNumberOfPages > pageNum)
  return productArray;
};

module.exports = getResults;
