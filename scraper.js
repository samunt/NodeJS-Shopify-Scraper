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
  };
  const result = await axios.get(url);
  return cheerio.load(result.data);
}

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
  let pageRefBestSellersOCS = ref.child('OCS-best-sellers-on-' + dateToString);
  let pageRefOCS = ref.child('OCS-full-product-listing-scrape-on-' + dateToString);
  let pageRefBC = ref.child('BC-full-product-listing-scrape-on-' + dateToString);
  let pageRefQC = ref.child('QC-full-product-listing-scrape-on-' + dateToString);
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

    productArrayBC.push({
      vendors: [...vendorBC],
      productTitle: [...productTitleBC],
      plantType: [...plantTypeBC],
      thcRange: [...thcRangeBC],
      cbdRange: [...cbdRangeBC],
      price: [...priceBC],
      date
    });
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
    // console.log('start ocs best sellers');
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

    bestSellersArrayOCS.push({
      vendors: [...bestSellersVendorOCS],
      productTitle: [...bestSellersTitleOCS],
      plantType: [...bestSellersPlantTypeOCS],
      thcRange: [...bestSellersTHCrangeOCS],
      cbdRange: [...bestSellersCBDrangeOCS],
      price: [...bestSellersPriceOCS],
      date
    });
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
      // console.log(pageNumOCS);
      // console.log('total num', totalNumberOfPagesOCS - 1)
      pageNumOCS++;
      // Convert to an array so that we can sort the results.
      // we need the IF because when you click to go to the next page, it just appends the product list with new data
      // so that means that the last page will have all the data, only if we went thru the pages from 1 .. n, one at a time
      const total = totalNumberOfPagesOCS - 1;
      // console.log('total', total);
      if (total == pageNumOCS) {
        productArrayOCS.push({
          vendors: [...vendorOCS],
          productTitle: [...productTitleOCS],
          plantType: [...plantTypeOCS],
          thcRange: [...thcRangeOCS],
          cbdRange: [...cbdRangeOCS],
          price: [...priceOCS],
          image: [...imageLinkOCS],
          date
        });
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
    // console.log('TEMPORARILY TURNED OFF SENDING DATA TO FIREBASE');
    pageRefOCS.set(productArrayOCS);
    pageRefBestSellersOCS.set(bestSellersArrayOCS);
    pageRefBC.set(productArrayBC);
    // console.log('305');
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
    // console.log('params', params);
    // OCSfullListing: productArrayOCS,
    //     OCSbestSellers: bestSellersArrayOCS,
    //     BCfullListing: productArrayBC

    visitor.event(params).send();
    // console.log('send');
  } else {
    ref.on("value", function(snapshot) {
      // console.log(snapshot.val());
      // scrapehash is an object that is a key-value pair ex.  OCS-full-scrape : [ { cbdRange : [...ranges], thcRange : [...ranges] }
      let scrapeHashVal = snapshot.val();

      const hasNewlineString = scrapeHashVal[0].match(/\\r?\\n|\\r/g) ? true : false;

      if (hasNewlineString) {
        scrapeHashVal.match(/\\r?\\n|\\r/g).replace('');
        scrapeHashVal.trimStart();
        scrapeHashVal.trimEnd();
        // console.log(scrapeHashVal);
      }
      return;
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
    // let db = admin.database();
    // // create db path reference
    // let ref = db.ref("scrapedPages/");
    // let dateToString = date.toString();
    // // prep db references by adding a timestamp
    // let pageRefBestSellersOCS = ref.child('OCS-best-sellers-on-' + dateToString);
    // let pageRefOCS = ref.child('OCS-full-product-listing-scrape-on-' + dateToString);
    // let pageRefBC = ref.child('BC-full-product-listing-scrape-on-' + dateToString);
    // let pageRefQC = ref.child('QC-full-product-listing-scrape-on-' + dateToString);

  };
  return;
};

module.exports = getResults;
