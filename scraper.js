const fetch = require('node-fetch');
let settings = { method: "Get" };

// this function is called first => from app.js
exports.getResults = (urlArray) => {
    // capture stores using Shopify
    for (let i = 0; i < urlArray.length; i++) {
        let jsonURL = urlArray[i];
        fetch(jsonURL, settings)
            .then(res => res.json())
            .then((JSONproductList) => {
                return JSONproductList;
            })
    }
};
