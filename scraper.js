const cheerio = require("cheerio");
const axios = require("axios");
let pageNum = 1;
let siteUrl = "https://ocs.ca/collections/all-cannabis-products?&page=" + pageNum + "&viewAll=true";
let productArray = [];
let vendor = [];
let productTitle = [];
let plantType = [];
let thcRange = [];
let cbdRange = [];
let price = [];
let totalNumberOfPages = undefined;
// called by getResults()
const fetchData = async () => {
  const result = await axios.get(siteUrl);
  return cheerio.load(result.data);
};

// this function is called from index.js
const getResults = async () => {
  const $ = await fetchData();

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

  totalNumberOfPages = $('.pagination li:nth-last-child(2)').text();

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
  console.log('total num pgs', totalNumberOfPages);
  // increment page number to get more products if the page count is less than total number of pages
  if (pageNum < totalNumberOfPages) {
    pageNum ++;
    console.log('page num', pageNum);
  };
};

module.exports = getResults;
