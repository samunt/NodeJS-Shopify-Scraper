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

const fetchDataFromExternalAPI = async (pageNum, province, type, collection) => {
  let url;
  if (province === 'ON' && type === 'JSON') {
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
  let dateToString = date.toString();
  let dateToStrNoSpaces = dateToString.replace(/\s/g, '');
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
    let pageRefOCS;

    let collectionsArray = [];
    let JSONproductList;
    // send the collection to the db

    // get collections and push to array
    JSONproductList = await fetchDataFromExternalAPI(null, 'ON', 'JSON', 'dried-flower-cannabis');
    collectionsArray.push(JSONproductList);
    guid = HelperFunctions.guid()
    pageRefOCS = refOCSfull.child('COLLECTION/' + 'dried-flower-cannabis' + '/GUID/' + guid + '/DATE/' + dateToStrNoSpaces);
    pageRefOCS.set(collectionsArray[0]);

    JSONproductList = await fetchDataFromExternalAPI(null, 'ON', 'JSON', 'pre-rolled');
    collectionsArray.push(JSONproductList);
    guid = HelperFunctions.guid()
    pageRefOCS = refOCSfull.child('COLLECTION/' + 'pre-rolled' + '/GUID/' + guid + '/DATE/' + dateToStrNoSpaces);
    pageRefOCS.set(collectionsArray[1]);

    JSONproductList = await fetchDataFromExternalAPI(null, 'ON', 'JSON', 'capsules');
    collectionsArray.push(JSONproductList);
    guid = HelperFunctions.guid()
    pageRefOCS = refOCSfull.child('COLLECTION/' + 'capsules' + '/GUID/' + guid + '/DATE/' + dateToStrNoSpaces);
    pageRefOCS.set(collectionsArray[2]);

    JSONproductList = await fetchDataFromExternalAPI(null, 'ON', 'JSON', 'oil');
    collectionsArray.push(JSONproductList);
    guid = HelperFunctions.guid()
    pageRefOCS = refOCSfull.child('COLLECTION/' + 'oil' + '/GUID/' + guid + '/DATE/' + dateToStrNoSpaces);
    pageRefOCS.set(collectionsArray[3]);

    JSONproductList = await fetchDataFromExternalAPI(null, 'ON', 'JSON', 'best-sellers');
    collectionsArray.push(JSONproductList);
    guid = HelperFunctions.guid()
    pageRefOCS = refOCSfull.child('COLLECTION/' + 'best-sellers' + '/GUID/' + guid + '/DATE/' + dateToStrNoSpaces);
    pageRefOCS.set(collectionsArray[4]);


    // https://ocs.ca/collections/best-sellers/products.json
    // dump the array of collections into a reference for the db


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
