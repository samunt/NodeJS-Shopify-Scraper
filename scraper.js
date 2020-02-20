const fetch = require('node-fetch');
let settings = { method: "Get" };

// this function is called first => from app.js
const getResults = () => {

    // TODO Add your URLs to this array to scrape the data in the CORRESPONDING pathArray Index
    let urlArray = ["https://www.someShopifyStore/collections/someShopifyCollection/product.json"];

    // capture stores using Shopify
    for (let i = 0; i < urlArray.length; i++) {
        let jsonURL = urlArray[i];
        fetch(jsonURL, settings)
            .then(res => res.json())
            .then((JSONproductList) => {
                //TODO - do something with the output. You can set it to a database, or return it to a front end
                console.log(JSONproductList)
                return;
            })
    }
};

module.exports = getResults;
