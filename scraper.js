const fetch = require('node-fetch');
const admin = require("firebase-admin");
const date = new Date();
let settings = { method: "Get" };

// this function is called first => from app.js
const getResults = () => {
    // Get a database reference to our blog
    // create db path reference
    let db = admin.database();
    // TODO add your firebase database reference
    let refOCSfull = db.ref("YourDBreference");

    let dateToString = date.toString();
    // TODO Add your collections to this array to identify what collection you are scraping in the DB
    let pathArray = ['driedFlowerCannabis'];

    // TODO Add your URLs to this array to scrape the data in the CORRESPONDING pathArray Index
    let urlArray = ["https://www.bccannabisstores.com/collections/flower/product.json"];

    // capture stores using Shopify
    for (let i = 0; i < urlArray.length; i++) {
        if (pathArray.length === urlArray.length) {
            let jsonURL = urlArray[i];
            let provinceRef = i <= 7 ? refBCfull : refOCSfull;
            let pathFromShopify = pathArray[i];
            let pageRef = provinceRef.child(pathFromShopify + "/" + dateToString);
            fetch(jsonURL, settings)
                .then(res => res.json())
                .then((JSONproductList) => {
                    pageRef.set(JSONproductList);
                    return;
                })
        }
    }
};

module.exports = getResults;
