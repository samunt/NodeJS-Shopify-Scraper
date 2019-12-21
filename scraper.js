// TODO
// Write script to homogenize the strings, get rid of extra spaces, slashes, etc.
// Write script to save an instance of the db to local machine so i dont waste so much money testing
// Sort by date (need to figure out how the object really looks like when it comes from firebase.
// k-NN -> figure out the model and data points we want to match
//

// I can traverse shopify store by collections
// URL is like /collections/{{handle}}/products.json
// OCS has: /collections/dried-flower-cannabis,  /collections/pre-rolled, /collections/capsules /oils
// Then we just parse the JSON!


const cheerio = require("cheerio");
const axios = require("axios");
const admin = require("firebase-admin");
const ua = require('universal-analytics');
const visitor = ua('UA-150484895-2');
const moment = require('moment');
const date = new Date();
const shouldRunScraper = true;
// $ is used for promises returned from url fetch
let $;

const fetchDataFromExternalAPI = async (pageNum, province, type, collection) => {
  let url;
  if (province === 'ON' && type === 'fullListing') {
    url = "https://ocs.ca/collections/all-cannabis-products?&page=" + pageNum;
  } else if (province === 'ON' && type === 'bestSellers') {
    url = "https://ocs.ca";
  } else if (province === 'BC' && type === 'fullListing') {
    url = "https://www.bccannabisstores.com/collections/cannabis-products?page=" + pageNum + "&grid_list=grid-view";
  } else if (province === 'QC' && type === 'fullListing') {
    url = "https://www.sqdc.ca/en-CA/Search?keywords=*&sortDirection=asc&page=" + pageNum;
  } else if (province === 'ON' && type === 'JSON') {
    url = "https://www.ocs.ca/collections/" + collection + "/products.json";
  };
  const result = await axios.get(url);
  return cheerio.load(result.data);
};

// this function is called first
const getResults = async () => {
  // Get a database reference to our blog
  let db = admin.database();
  // create db path reference
  let refOCSfull = db.ref("OCSfullJSONversion/");
  let refOCSbestSellers = db.ref("OCSbestSellers/0");
  let refBCfull = db.ref("BCfull/0");
  let dateToString = date.toString();
  const Helper = require('./helperFunctions')
  const HelperFunctions = new Helper(3000, 8000, null);
  // prep db references by adding a timestamp
  console.log('guid', HelperFunctions.guid());
  let pageRefBestSellersOCS = refOCSbestSellers.child(HelperFunctions.guid());
  let guid = HelperFunctions.guid();
  let pageRefOCS = refOCSfull.child(dateToString + '/GUID/' + guid);
  let pageRefBC = refBCfull.child(HelperFunctions.guid());
  if (shouldRunScraper === true) { //

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
    let productArrayOCS = [];

    let collectionsArray = [];
    let JSONproductList;
    JSONproductList = await fetchDataFromExternalAPI(null, 'ON', 'JSON', 'dried-flower-cannabis');
    collectionsArray.push(JSONproductList);
    JSONproductList = await fetchDataFromExternalAPI(null, 'ON', 'JSON', 'pre-rolled');
    collectionsArray.push(JSONproductList);
    JSONproductList = await fetchDataFromExternalAPI(null, 'ON', 'JSON', 'capsules');
    collectionsArray.push(JSONproductList);
    JSONproductList = await fetchDataFromExternalAPI(null, 'ON', 'JSON', 'oil');
    collectionsArray.push(JSONproductList);

    for (let i = 0; i < 4; i++) {
      pageRefOCS.set(collectionsArray[i]);
    }


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
    // pageRefOCS.set(productArrayOCS);
    pageRefBestSellersOCS.set(bestSellersArrayOCS);
    // pageRefBC.set(productArrayBC);
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
