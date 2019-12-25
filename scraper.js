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
const fetch = require('node-fetch');
const admin = require("firebase-admin");
const ua = require('universal-analytics');
const visitor = ua('UA-150484895-2');
const moment = require('moment');
const date = new Date();
const shouldRunScraper = true;
let settings = { method: "Get" };

// this function is called first
const getResults = async () => {
  // Get a database reference to our blog
  let db = admin.database();
  // create db path reference
  let refOCSfull = db.ref("OCStwoPointOscrape");
  let dateToString = date.toString();
  const Helper = require('./helperFunctions')
  const HelperFunctions = new Helper(3000, 8000, null);
  // prep db references by adding a timestamp
  let guid = HelperFunctions.guid();
  if (shouldRunScraper === true) { //

    ////////////////////////////////////////
    //
    //  ALL SHOPIFY COLLECTIONS FROM OCS BELOW
    //
    ////////////////////////////////////////

    // get collections and push to array
    let urlDry = "https://www.ocs.ca/collections/" + 'dried-flower-cannabis' + "/products.json";
    let pageRefOCSdry = refOCSfull.child('COLLECTION/' + 'dried-flower-cannabis' + dateToStr);
    fetch(urlDry, settings)
        .then(res => res.json())
        .then((JSONproductListDriedFlower) => {
          // console.log(json)
          // do something with JSON
          pageRefOCSdry.set(JSONproductListDriedFlower);
          console.log('dried flow')
          return;
        });

    let urlPre = "https://www.ocs.ca/collections/" + 'pre-rolled' + "/products.json";
    let pageRefOCSpreRolled = refOCSfull.child('COLLECTION/' + 'pre-rolled' + dateToString);
    fetch(urlPre, settings)
        .then(res => res.json())
        .then((JSONproductListPreRolled) => {
          // console.log(json)
          // do something with JSON
          pageRefOCSpreRolled.set(JSONproductListPreRolled);
          console.log('pre roll')
          return;
        });

    let urlCapsule = "https://www.ocs.ca/collections/" + 'capsules' + "/products.json";
    let pageRefOCScapsules = refOCSfull.child('COLLECTION/' + 'capsules' + dateToString);
    fetch(urlCapsule, settings)
        .then(res => res.json())
        .then((JSONproductListCapsules) => {
          // do something with JSON
          pageRefOCScapsules.set(JSONproductListCapsules);
          console.log('capsule')
          return;
        });

    let urlOil = "https://www.ocs.ca/collections/" + 'oil' + "/products.json";
    let pageRefOCSoil = refOCSfull.child('COLLECTION/' + 'oil' + dateToString);
    fetch(urlOil, settings)
        .then(res => res.json())
        .then((JSONproductListOil) => {
          // do something with JSON
          pageRefOCSoil.set(JSONproductListOil);
          console.log('oil')
          return;
        });

    let urlBestSellers = "https://www.ocs.ca/collections/" + 'best-sellers' + "/products.json";
    let pageRefOCSbestSellers = refOCSfull.child('COLLECTION/' + 'oil' + dateToString);
    fetch(urlBestSellers, settings)
        .then(res => res.json())
        .then((JSONproductListBestSellers) => {
          // do something with JSON
          pageRefOCSbestSellers.set(JSONproductListBestSellers);
          console.log('best seller')
          return;
        });

    ////////////////////////////////////////
    //
    //  FULL PRODUCT LISTING FROM OCS ABOVE
    //
    ////////////////////////////////////////

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
        // console.log(rawArrFirstVal);
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
