const cheerio = require("cheerio");
const axios = require("axios");
const admin = require("firebase-admin");
const ua = require('universal-analytics');
const visitor = ua('UA-150484895-2');
const date = new Date();
const shouldRunScraper = true;
// $ is used for promises returned from url fetch
let $;

// const fetchIndividualProductDataForQC = async (productURL) => {
//   let url = productURL;
//   const result = await axios.get(url);
//   return cheerio.load(result.data);
// };

function guid() {
  function _p8(s) {
    let p = (Math.random().toString(16)+"000000000").substr(2,8);
    return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
  }
  return _p8() + _p8(true) + _p8(true) + _p8();
}

const fetchDataFromExternalAPI = async (pageNum, province, type) => {
  let url;
  if (province === 'ON' && type === 'fullListing') {
    url = "https://ocs.ca/collections/all-cannabis-products?&page=" + pageNum;
  } else if (province === 'ON' && type === 'bestSellers') {
    url = "https://ocs.ca";
  } else if (province === 'BC' && type === 'fullListing') {
    url = "https://www.bccannabisstores.com/collections/cannabis-products?page=" + pageNum + "&grid_list=grid-view";
  } else if (province === 'QC' && type === 'fullListing') {
    url = "https://www.sqdc.ca/en-CA/Search?keywords=*&sortDirection=asc&page=" + pageNum;
  }
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
  let refOCSfull = db.ref("OCSfull/0");
  let refOCSbestSellers = db.ref("OCSbestSellers/0");
  let refBCfull = db.ref("BCfull/0");
  let dateToString = date.toString();
  // prep db references by adding a timestamp
  let pageRefBestSellersOCS = refOCSbestSellers.child(guid());
  let pageRefOCS = refOCSfull.child(guid());
  let pageRefBC = refBCfull.child(guid());
  if (shouldRunScraper === true) { //
    ///////////////////////////////
    //
    // FULL LISTING FROM quebec BELOW
    //
    ///////////////////////////////
    let productArrayQC = [];
    let productTitleQC = [];
    let plantTypeQC = [];
    let thcRangeQC = [];
    let cbdRangeQC = [];
    let priceQC = [];
    let vendorQC = [];
    let totalNumberOfPagesQC = 1;
    let pageNumQC = 1;

    // do {
    //   $ = await fetchDataForQCfullProductListing();
    //   // only need to do this once
    //   if (pageNumBC == 1) {
    //     totalNumberOfPagesQC = parseInt($('.pagination li:nth-last-child(2) a').text());
    //   }
    //   // go through each page
    //   // go through each item on each page
    //     // get get url for each item
    //     // put url into array
    //   // fetch product
    //   pageNumQC++;
    //   await sleep(getRandomInt(3000, 8000));
    // } while (totalNumberOfPagesQC > pageNumQC);

    ///////////////////////////////
    //
    // FULL LISTING FROM quebec ABOVE
    //
    ///////////////////////////////

    ///////////////////////////////
    //
    // FULL LISTING FROM bccannabisstores BELOW
    //
    ///////////////////////////////
    // console.log('start bc');
    let productArrayBC = [];
    let productTitleBC = [];
    let plantTypeBC = [];
    let thcRangeBC = [];
    let cbdRangeBC = [];
    let priceBC = [];
    let vendorBC = [];
    let totalNumberOfPagesBC = 1;
    let pageNumBC = 1;
    let imgLinkBC = [];

    // do statement is for the page iterator
    // console.log('BC stuff')
    console.log('1')
    do {
      $ = await fetchDataFromExternalAPI(pageNumBC, 'BC', 'fullListing');
      // only need to do this once
      if (pageNumBC == 1) {
        totalNumberOfPagesBC = parseInt($('.pagination--inner li:nth-last-child(2) a').text());
      }
      $('.productitem--title a span').each((index, element) => {
        productTitleBC.push($(element).text());
      });
      $('.productitem--vendor').each((index, element) => {
        vendorBC.push($(element).text());
      });
      $('.price--main .money').each((index, element) => {
        priceBC.push($(element).text());
      });
      $('.productitem--strain-characteristics span:nth-child(1)').each((index, element) => {
        thcRangeBC.push($(element).text());
      });
      $('.productitem--strain-characteristics span:nth-child(2)').each((index, element) => {
        cbdRangeBC.push($(element).text());
        plantTypeBC.push('Not Available')
      });
      $('.productitem--image-link img').each((index, element) => {
        imgLinkBC.push($(element).attr('src'));
      });
      pageNumBC++;
      await sleep(getRandomInt(3000, 8000));
    } while (totalNumberOfPagesBC > pageNumBC);
    const dbBCparams = {
      date: new Date().toDateString(),
      vendors: [...vendorBC],
      productTitle: [...productTitleBC],
      plantType: [...plantTypeBC],
      thcRange: [...thcRangeBC],
      cbdRange: [...cbdRangeBC],
      price: [...priceBC]
    };
    productArrayBC.push(dbBCparams);
    ///////////////////////////////////////
    //
    // FULL LISTING FROM bccannabisstores ABOVE
    //
    ///////////////////////////////

    ///////////////////////////////
    //
    //  BEST SELLERS FROM OCS BELOW
    //
    ///////////////////////////////
    // best sellers stuff
    console.log('start ocs best sellers');
    let bestSellersVendorOCS = [];
    let bestSellersTitleOCS = [];
    let bestSellersPlantTypeOCS = [];
    let bestSellersTHCrangeOCS = [];
    let bestSellersCBDrangeOCS = [];
    let bestSellersPriceOCS = [];
    let bestSellersArrayOCS = [];
    $ = undefined;
    $ = await fetchDataFromExternalAPI(null, 'ON', 'bestSellers');
    // grab vendor
    $('.product-carousel__products article h4').each((index, element) => {
      if (index === 0 || index % 3 === 0) {
        bestSellersVendorOCS.push($(element).text());
      }
    });
    // grab title
    $('.product-carousel__products .product-tile__data h3').each((index, element) => {
      bestSellersTitleOCS.push($(element).text());
    });
    // grab plant type
    $('.product-carousel__products .product-tile__properties li:nth-child(1) p').each((index, element) => {
      bestSellersPlantTypeOCS.push($(element).text());
    });
    // grab thc range
    $('.product-carousel__products .product-tile__properties li:nth-child(2) p').each((index, element) => {
      bestSellersTHCrangeOCS.push($(element).text());
    });
    //grab cbd range
    $('.product-carousel__products .product-tile__properties li:nth-child(3) p').each((index, element) => {
      bestSellersCBDrangeOCS.push($(element).text());
    });
    $('.product-carousel__products .product-tile__info .product-tile__price').each((index, element) => {
      bestSellersPriceOCS.push($(element).text());
    });
    const dbParams = {
      date: new Date().toDateString(),
      vendors: [...bestSellersVendorOCS],
      productTitle: [...bestSellersTitleOCS],
      plantType: [...bestSellersPlantTypeOCS],
      thcRange: [...bestSellersTHCrangeOCS],
      cbdRange: [...bestSellersCBDrangeOCS],
      price: [...bestSellersPriceOCS]
    };
    bestSellersArrayOCS.push(dbParams);

    ////////////////////////////////////////
    //
    //  BEST SELLERS FROM OCS ABOVE
    //
    ////////////////////////////////////////

    ////////////////////////////////////////
    //
    //  FULL LISTING FROM OCS BELOW
    //
    ////////////////////////////////////////
    // console.log('start ocs full listing');
    let vendorOCS = [];
    let productTitleOCS = [];
    let plantTypeOCS = [];
    let thcRangeOCS = [];
    let cbdRangeOCS = [];
    let priceOCS = [];
    let totalNumberOfPagesOCS = 1;
    let productArrayOCS = [];
    let pageNumOCS = 1;
    let imageLinkOCS = [];

    do {
      $ = await fetchDataFromExternalAPI(pageNumOCS, 'ON', 'fullListing');
      // first check how many total pages there are - only need to do once
      if (pageNumOCS === 1) {
        totalNumberOfPagesOCS = parseInt($('.pagination li:nth-last-child(2)').text());
      }
      // use fetched data to grab elements (and their text) and push into arrays defined above
      // get vendor
      $('.product-tile__vendor').each((index, element) => {
        vendorOCS.push($(element).text());
      });
      // grab product title
      $('.product-tile__title').each((index, element) => {
        productTitleOCS.push($(element).text());
      });
      // grab plant type
      $('.product-tile__plant-type').each((index, element) => {
        plantTypeOCS.push($(element).text());
      });
      // grab thc range
      $('.product-tile__properties  li:nth-child(2) p').each((index, element) => {
        thcRangeOCS.push($(element).text());
      });
      // grab cbd range
      $('.product-tile__properties  li:nth-child(3) p').each((index, element) => {
        cbdRangeOCS.push($(element).text());
      });
      // grab price
      $('.product-tile__price').each((index, element) => {
        priceOCS.push($(element).text());
      });
      //grab image url
      $('.product-tile__image img').each((index, element) => {
        imageLinkOCS.push($(element).attr('src'));
      });
      pageNumOCS++;
      // Convert to an array so that we can sort the results.
      // we need the IF because when you click to go to the next page, it just appends the product list with new data
      // so that means that the last page will have all the data, only if we went thru the pages from 1 .. n, one at a time
      const total = totalNumberOfPagesOCS - 1;
      if (total == pageNumOCS) {
        const dbOCSfullParams = {
          date: 'date',
          vendors: [...vendorOCS],
          productTitle: [...productTitleOCS],
          plantType: [...plantTypeOCS],
          thcRange: [...thcRangeOCS],
          cbdRange: [...cbdRangeOCS],
          price: [...priceOCS],
          image: [...imageLinkOCS]
        };
        productArrayOCS.push(dbOCSfullParams);
        console.log('4')
      }
      await sleep(getRandomInt(3000, 8000));
    } while (totalNumberOfPagesOCS > pageNumOCS);
    ////////////////////////////////////////
    //
    //  FULL PRODUCT LISTING FROM OCS ABOVE
    //
    ////////////////////////////////////////

    ////////////////////////////////////////
    //
    //  SEND DATA SETS TO FIREBASE BELOW
    //
    ////////////////////////////////////////
    // send data to DB
    console.log('here')
    pageRefOCS.set(productArrayOCS);
    pageRefBestSellersOCS.set(bestSellersArrayOCS);
    pageRefBC.set(productArrayBC);
    ////////////////////////////////////////
    //
    //  SEND DATA SETS TO FIREBASE ABOVE
    //
    ////////////////////////////////////////
    const params = {
      ec: "Provincial Store Full Listing",
      ea: "Scrape",
      el: "OCSfullListing",
      productArrayOCS
    };
  } else {
    return;
  };
  return;
};

module.exports = getResults;
