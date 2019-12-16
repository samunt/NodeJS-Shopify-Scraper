// TODO
// Write script to homogenize the strings, get rid of extra spaces, slashes, etc.
// Write script to save an instance of the db to local machine so i dont waste so much money testing
// Sort by date (need to figure out how the object really looks like when it comes from firebase.
// k-NN -> figure out the model and data points we want to match
//


const cheerio = require("cheerio");
const axios = require("axios");
const admin = require("firebase-admin");
const ua = require('universal-analytics');
const visitor = ua('UA-150484895-2');
const moment = require('moment');
const date = new Date();
const shouldRunScraper = false;
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
  } else if (type === 'individualPage') {

  };
  const result = await axios.get(url);
  return cheerio.load(result.data);
};

// this function is called first
const getResults = async () => {
  // Get a database reference to our blog
  let db = admin.database();
  // create db path reference
  let refOCSfull = db.ref("OCSfullVersion2/");
  let refOCSbestSellers = db.ref("OCSbestSellers/0");
  let refBCfull = db.ref("BCfull/0");
  let dateToString = date.toString();
  const Helper = require('./helperFunctions')
  const HelperFunctions = new Helper(3000, 8000, null);
  // prep db references by adding a timestamp
  console.log('guid', HelperFunctions.guid());
  let pageRefBestSellersOCS = refOCSbestSellers.child(HelperFunctions.guid());
  let pageRefOCS = refOCSfull.child(HelperFunctions.guid());
  let pageRefBC = refBCfull.child(HelperFunctions.guid());
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
    // console.log('1')
    do {
      // console.log('before')
      $ = await fetchDataFromExternalAPI(pageNumBC, 'BC', 'fullListing');
      // only need to do this once
      if (pageNumBC == 1) {
        totalNumberOfPagesBC = parseInt($('.pagination--inner li:nth-last-child(2) a').text());
        // console.log('page bc', totalNumberOfPagesBC);
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
      const val = HelperFunctions.getRandomInt();
      const HelperSleep1 = new Helper(null, null, val)
      await HelperSleep1.sleep(val);
      console.log('random', HelperFunctions.getRandomInt())
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
    let genericProductModel = {
      productType: null,
      cbdRangeForBud: null ,
      thcRangeForBud: null,
      gramsOfBudPerUnit: null,
      cbdMgPerMl: null,
      thcMgPerMl: null,
      grams: null,
      pricePerGram: null,
      inStock: null,
      mlPerBottle: null,
      capsulesPerBottle: null,
      thcMgPerCapsule: null,
      cbdMgPerCapsule: null,
      date: null,
      imageUrl: null,
      plantType: null,
      price: null,
      mlPerUnit: null,
      terpenes: [],
      vendor: null,
      productTitle: null
    };

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
    let inStockOCS = [];
    let arrToHoldLinksOfPages = [];

    do {
      //  1. go to ocs /all-cannabis products + pageNum
      $ = await fetchDataFromExternalAPI(pageNumOCS, 'ON', 'fullListing');
      // first check how many total pages there are - only need to do once
      if (pageNumOCS === 1) {
        totalNumberOfPagesOCS = parseInt($('.pagination li:nth-last-child(2)').text());
        // console.log('total number of pages', totalNumberOfPagesOCS);
      }
      //  2. get href of i of all the .product-tile__title of the page and put into array
      $('.product-tile__info .product-tile__data a').each((index, element) => {
        let link = $(value).attr('href');
        arrToHoldLinksOfPages.push(link);
      });
      //  3. while (i < i.length)
      let counter = 0
      do {
        //  3.1. go to href of i like https://ocs.ca/products/napali-cbd-pre-roll-haven-st
        $ = await fetchDataFromExternalAPI(null, null, 'individualPage');
        // 3.2 fill up the model, and if the element doesnt exist, add null.

        // in stock
        // check if pre roll
        if ($('.product__title h2').text().includes('Pre-Roll')) {
          genericProductModel.productType = 'Pre-Roll';
          genericProductModel.productTitle = $('.product__title h2').text();
          $('.notice .notice--stock .online-availability-wrapper h5 .notice__heading').text().includes('In stock') ?
              genericProductModel.inStock = true : genericProductModel.inStock = false;
          if ($('.swatches li label').hasAttribute('aria-describedby')) {
            let grams = $('.swatches li label .swatch__total').text();
            let totalPrice = $('.swatches li label .swatch__price').text().toInt();

            genericProductModel.gramsOfBudTotal = grams;
            genericProductModel.pricePerGram = totalPrice;
          }
        }


        let genericProductModel = {
          productType: null,
          cdbRangeForBud: null ,
          thcRangeForBud: null,
          gramsOfBudPerUnit: null,
          gramsOfBudTotal: null,
          cbdMgPerMl: null,
          thcMgPerMl: null,
          grams: null,
          pricePerGram: null,
          inStock: null,
          mlPerBottle: null,
          capsulesPerBottle: null,
          thcMgPerCapsule: null,
          cbdMgPerCapsule: null,
          date: null,
          imageUrl: null,
          plantType: null,
          price: null,
          mlPerUnit: null,
          terpenes: [],
          vendor: null,
          productTitle: null
        };
        counter++;
      } while (counter < arrToHoldLinksOfPages.length);
      const val = HelperFunctions.getRandomInt();
      const HelperSleep2 = new Helper(null, null, val)
      await HelperSleep2.sleep();
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
    // console.log('here')
    pageRefOCS.set(productArrayOCS);
    pageRefBestSellersOCS.set(bestSellersArrayOCS);
    pageRefBC.set(productArrayBC);
    // console.log('here2')
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

    // OCSfull.0.{{GUID}}.0.date
    let rawArray = [];
    refOCSfull.on("value", function(snapshot) {
      rawArray.push(snapshot.val())
      // rawArray[0][Object.keys(rawArray[0])[0]] is the way to access the first data GUID as our data is in the first property value in the obj returned from firebase
      let singleDayScrape = rawArray[0][Object.keys(rawArray[0])[0]];
      let fullCategoryScrape = [];
      // go through all records - n is arbitrary
      const rawArrFirstVal = rawArray[0]
      const numOfRecordsOnBranch = Object.keys(rawArrFirstVal).length;
      for (let i = 0; i < numOfRecordsOnBranch; i++) {
        console.log(rawArrFirstVal);
        // console.log(rawArrFirstVal[0].hasOwnProperty('date'))
        // if (Object.keys(rawArrFirstVal)[i].date !== 'date') {
        //   console.log(rawArrFirstVal[i])
        //   fullCategoryScrape.push(rawArrFirstVal[Object.keys(rawArrFirstVal)[i]]);
        // } else {
        //   console.log('not a real date')
        // }
      }
      let sortedByDateFullCategory = fullCategoryScrape.sort(function (left, right) {
        return moment.utc(left.date).diff(moment.utc(right.date))
      });
      // console.log('sorted',sortedByDateFullCategory);
    }, function (errorObject) {
      // console.log("The read failed: " + errorObject.code);
    });
    return;
  };
  return;
};

module.exports = getResults;
