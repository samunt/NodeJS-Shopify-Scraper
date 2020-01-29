const fetch = require('node-fetch');
const admin = require("firebase-admin");
const date = new Date();
let settings = { method: "Get" };

// this function is called first => from app.js
const getResults = () => {
    // Get a database reference to our blog
    // create db path reference
    let db = admin.database();
    let refOCSfull = db.ref("ONTARIO-OCS");
    let refBCfull = db.ref("BC-BCCS");

    let dateToString = date.toString();

    let pathArray = ['driedFlowerCannabis', 'preRolls', 'vapeKitsCartridges', 'oilProducts',
        'capsules', 'bakedGoodsSnacks', 'chocolate', 'candy',
        'driedFlowerCannabis', 'preRolled', 'capsules', 'oilProducts',
        'bestSellers', 'cartridges', 'confectionary', 'beverages', 'baked-goods'];
    let urlArray = ["https://www.bccannabisstores.com/collections/flower/product.json",
        "https://www.bccannabisstores.com/collections/pre-rolls/products.json",
        "https://www.bccannabisstores.com/collections/vape-kits-cartridges/products.json",
        "https://www.bccannabisstores.com/collections/oil-products/products.json",
        "https://www.bccannabisstores.com/collections/capsules/products.json",
        "https://www.bccannabisstores.com/collections/baked-goods-snacks/products.json",
        "https://www.bccannabisstores.com/collections/chocolate/products.json",
        "https://www.bccannabisstores.com/collections/chews-candy/products.json",

        "https://www.ocs.ca/collections/dried-flower-cannabis/products.json",
        "https://www.ocs.ca/collections/pre-rolled/products.json",
        "https://www.ocs.ca/collections/capsules/products.json",
        "https://www.ocs.ca/collections/oils/products.json",
        "https://www.ocs.ca/collections/best-sellers/products.json",
        "https://www.ocs.ca/collections/cartridges/products.json",
        "https://www.ocs.ca/collections/confectionary/products.json",
        "https://www.ocs.ca/collections/beverages/products.json",
        "https://www.ocs.ca/collections/baked-goods/products.json",
    ];

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
