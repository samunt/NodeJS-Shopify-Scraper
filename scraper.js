const fetch = require('node-fetch');
const admin = require("firebase-admin");
const fs = require('graceful-fs')
const json2xls = require('json2xls');
const date = new Date();
const shouldRunScraper = true;
let settings = { method: "Get" };

// this function is called first => from app.js
const getResults = async () => {
  // Get a database reference to our blog
  let db = admin.database();
  // create db path reference
  let refOCSfull = db.ref("ONTARIO-OCS");
  let refBCfull = db.ref("BC-BCCS");
  let dateToString = date.toString();
  // prep db references by adding a timestamp
  if (shouldRunScraper === true) {
      // BC CANNABIS STORE

      let urlDryBC = "https://www.bccannabisstores.com/collections/flower/product.json";
      let pageRefBCdry = refBCfull.child( 'dried-flower-cannabis/' + dateToString);
      fetch(urlDryBC, settings)
          .then(res => res.json())
          .then((JSONproductListDriedFlower) => {
              pageRefBCdry.set(JSONproductListDriedFlower);
              console.log('dried flower bc')
              return;
          });

      let urlPrerollBC = "https://www.bccannabisstores.com/collections/pre-rolls/products.json";
      let pageRefBCpreroll = refBCfull.child( 'dried-flower-cannabis/' + dateToString);
      fetch(urlPrerollBC, settings)
          .then(res => res.json())
          .then((JSONproductPreroll) => {
              pageRefBCpreroll.set(JSONproductPreroll);
              console.log('pre roll bc')
              return;
          });

      let urlBCvape = "https://www.bccannabisstores.com/collections/vape-kits-cartridges/products.json";
      let pageRefBCvape = refBCfull.child( 'vape-kits-cartridges/' + dateToString);
      fetch(urlBCvape, settings)
          .then(res => res.json())
          .then((JSONproductListVape) => {
              pageRefBCvape.set(JSONproductListVape);
              console.log('pre roll bc')
              return;
          });

      let urlBCoil = "https://www.bccannabisstores.com/collections/oil-products/products.json";
      let pageRefBCoil = refBCfull.child( 'oil-products/' + dateToString);
      fetch(urlBCoil, settings)
          .then(res => res.json())
          .then((JSONproductListOil) => {
              pageRefBCoil.set(JSONproductListOil);
              console.log('oil bc')
              return;
          });

      let urlBCcapsules = "https://www.bccannabisstores.com/collections/capsules/products.json";
      let pageRefBCcapsules = refBCfull.child( 'capsules/' + dateToString);
      fetch(urlBCcapsules, settings)
          .then(res => res.json())
          .then((JSONproductListCapsules) => {
              pageRefBCcapsules.set(JSONproductListCapsules);
              console.log('capsules bc')
              return;
          });

      let urlBCediblesBaked = "https://www.bccannabisstores.com/collections/baked-goods-snacks/products.json";
      let pageRefBCediblesBaked = refBCfull.child( 'baked-goods-snacks/' + dateToString);
      fetch(urlBCediblesBaked, settings)
          .then(res => res.json())
          .then((JSONproductListediblesBaked) => {
              pageRefBCediblesBaked.set(JSONproductListediblesBaked);
              console.log('baked bc')
              return;
          });

      let urlBCedibleschocolate = "https://www.bccannabisstores.com/collections/chocolate/products.json";
      let pageRefBCedibleschocolate = refBCfull.child( 'chocolate/' + dateToString);
      fetch(urlBCedibleschocolate, settings)
          .then(res => res.json())
          .then((JSONproductListedibleschocolate) => {
              pageRefBCedibleschocolate.set(JSONproductListedibleschocolate);
              console.log('chocolate bc')
              return;
          });

      let urlBCediblesCandy = "https://www.bccannabisstores.com/collections/chews-candy/products.json";
      let pageRefBCediblesCandy = refBCfull.child( 'candy/' + dateToString);
      fetch(urlBCediblesCandy, settings)
          .then(res => res.json())
          .then((JSONproductListediblesCandy) => {
              pageRefBCediblesCandy.set(JSONproductListediblesCandy);
              console.log('candy bc')
              return;
          });

      // ONTARIO CANNABIS STORE (OCS)
      // get collections and push to array
      let urlDryOCS = "https://www.ocs.ca/collections/" + 'dried-flower-cannabis' + "/products.json";
      let pageRefOCSdry = refOCSfull.child( 'dried-flower-cannabis/' + dateToString);
      fetch(urlDryOCS, settings)
          .then(res => res.json())
          .then((JSONproductListDriedFlower) => {
          // console.log(json)
          // do something with JSON
            pageRefOCSdry.set(JSONproductListDriedFlower);
            console.log('dried flower')
            return;
          });

      let urlPre = "https://www.ocs.ca/collections/" + 'pre-rolled' + "/products.json";
      let pageRefOCSpreRolled = refOCSfull.child('pre-rolled/' + dateToString);
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
      let pageRefOCScapsules = refOCSfull.child('capsules/' + dateToString);
      fetch(urlCapsule, settings)
          .then(res => res.json())
          .then((JSONproductListCapsules) => {
          // do something with JSON
            pageRefOCScapsules.set(JSONproductListCapsules);
            console.log('capsule')
            return;
          });

      let urlOil = "https://www.ocs.ca/collections/" + 'oil' + "/products.json";
      let pageRefOCSoil = refOCSfull.child('oil/' + dateToString);
      fetch(urlOil, settings)
          .then(res => res.json())
          .then((JSONproductListOil) => {
          // do something with JSON
            pageRefOCSoil.set(JSONproductListOil);
            console.log('oil')
            return;
          });

      let urlBestSellers = "https://www.ocs.ca/collections/" + 'best-sellers' + "/products.json";
      let pageRefOCSbestSellers = refOCSfull.child( 'oil/' + dateToString);
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
      // TO DELETE DIRECTORIES
      // db.ref('BC-BCCS/' ).remove().then(function(){
      //     console.log('BC deleted')
      // }).catch(function(){
      //     console.log('BC not deleted')
      // });

      // TO FETCH DIRECTORIES
      db.ref('ONTARIO-OCS').once('value').then(function(snapshot) {
          let snap = snapshot.val();
          let xls = json2xls(snap);
          fs.writeFileSync('data.xlsx', xls, 'binary')
          console.log('done writing to xls')
      });

      // we need to take  db.ref('ONTARIO-OCS').once
      // iterate through COLLECTIONS
          // iterate through DATE
            // iterate through PRODUCTS
                // iterate through TAGS
                    // if tag has string 'subcategory--' but not 'subsubcategory'
                        // if subsubcategory has string 'Capsules'
                        // if subsubcategory has string 'Dried Flower'
                        // if subsubcategory has string 'Pre-Rolled'
                        // if subsubcategory has string 'Oil' ??????????? we dont know this one

  };
  return;
};

module.exports = getResults;
