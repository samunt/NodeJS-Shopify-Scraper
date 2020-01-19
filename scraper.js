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

    let pathArray = ['driedFlowerBCCS',
        'preRollsBCCS',
        'vapeCartridgesBCCS',
        'oilProductsBCCS',
        'capsulesBCCS',
        'bakedGoodsBCCS',
        'chocolateBCCS',
        'chewsCandy',
        'driedFlowerOCS',
        'preRollsOCS',
        'capsulesOCS',
        'oilProductsOCS',
        'bestSellersOCS'];
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
        "https://www.ocs.ca/collections/best-sellers/products.json"
    ];
    // BC CANNABIS STORE

    let urlDryBC = "https://www.bccannabisstores.com/collections/flower/product.json";
    let pageRefBCdry = refBCfull.child( 'driedFlowerCannabis/' + dateToString);
    fetch(urlDryBC, settings)
        .then(res => res.json())
        .then((JSONproductListDriedFlower) => {
            pageRefBCdry.set(JSONproductListDriedFlower);
            console.log('dried flower bc')
            return;
        });

    let urlPrerollBC = "https://www.bccannabisstores.com/collections/pre-rolls/products.json";
    let pageRefBCpreroll = refBCfull.child( 'preRolls/' + dateToString);
    fetch(urlPrerollBC, settings)
        .then(res => res.json())
        .then((JSONproductPreroll) => {
            pageRefBCpreroll.set(JSONproductPreroll);
            console.log('pre roll bc')
            return;
        });

    let urlBCvape = "https://www.bccannabisstores.com/collections/vape-kits-cartridges/products.json";
    let pageRefBCvape = refBCfull.child( 'vapeKitsCartridges/' + dateToString);
    fetch(urlBCvape, settings)
        .then(res => res.json())
        .then((JSONproductListVape) => {
            pageRefBCvape.set(JSONproductListVape);
            console.log('vape cartridge bc')
            return;
        });

    let urlBCoil = "https://www.bccannabisstores.com/collections/oil-products/products.json";
    let pageRefBCoil = refBCfull.child( 'oilProducts/' + dateToString);
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
    let pageRefBCediblesBaked = refBCfull.child( 'bakedGoodsSnacks/' + dateToString);
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

    let urlVapeOCS = "https://www.ocs.ca/collections/" + 'cartridges' + "/products.json";
    let pageRefOCSvape = refOCSfull.child('cartridges/' + dateToString);
    fetch(urlVapeOCS, settings)
        .then(res => res.json())
        .then((JSONproductListCartridges) => {
           pageRefOCSvape.set(JSONproductListCartridges);
           console.log('VAPES');
           return;
        });

    let urlConfOCS = "https://www.ocs.ca/collections/" + 'confectionary' + "/products.json";
    let pageRefOCSconf = refOCSfull.child('confectionary/' + dateToString);
    fetch(urlConfOCS, settings)
        .then(res => res.json())
        .then((JSONproductListConf) => {
            pageRefOCSconf.set(JSONproductListConf);
            console.log('Conf ');
            return;
        });

    let urlbeveragesOCS = "https://www.ocs.ca/collections/" + 'beverages' + "/products.json";
    let pageRefOCSbeverages = refOCSfull.child('beverages/' + dateToString);
    fetch(urlbeveragesOCS, settings)
        .then(res => res.json())
        .then((JSONproductListBev) => {
            pageRefOCSbeverages.set(JSONproductListBev);
            console.log('bev ');
            return;
        });

    let urlbakedOCS = "https://www.ocs.ca/collections/" + 'baked-goods' + "/products.json";
    let pageRefOCSbaked = refOCSfull.child('baked-goods/' + dateToString);
    fetch(urlbakedOCS, settings)
        .then(res => res.json())
        .then((JSONproductListBaked) => {
            pageRefOCSbaked.set(JSONproductListBaked);
            console.log('baked ');
            return;
        });

    let urlDryOCS = "https://www.ocs.ca/collections/" + 'dried-flower-cannabis' + "/products.json";
    let pageRefOCSdry = refOCSfull.child( 'driedFlowerCannabis/' + dateToString);
    fetch(urlDryOCS, settings)
        .then(res => res.json())
        .then((JSONproductListDriedFlower) => {
            // console.log(json)
            // do something with JSON
            pageRefOCSdry.set(JSONproductListDriedFlower);
            console.log('dried flower ocs')
            return;
        });

    let urlPre = "https://www.ocs.ca/collections/" + 'pre-rolled' + "/products.json";
    let pageRefOCSpreRolled = refOCSfull.child('preRolled/' + dateToString);
    fetch(urlPre, settings)
        .then(res => res.json())
        .then((JSONproductListPreRolled) => {
            // console.log(json)
            // do something with JSON
            pageRefOCSpreRolled.set(JSONproductListPreRolled);
            console.log('pre roll ocs')
            return;
        });

    let urlCapsule = "https://www.ocs.ca/collections/" + 'capsules' + "/products.json";
    let pageRefOCScapsules = refOCSfull.child('capsules/' + dateToString);
    fetch(urlCapsule, settings)
        .then(res => res.json())
        .then((JSONproductListCapsules) => {
            // do something with JSON
            pageRefOCScapsules.set(JSONproductListCapsules);
            console.log('capsule ocs')
            return;
        });

    let urlOil = "https://www.ocs.ca/collections/" + 'oils' + "/products.json";
    let pageRefOCSoil = refOCSfull.child('oilProducts/' + dateToString);
    fetch(urlOil, settings)
        .then(res => res.json())
        .then((JSONproductListOil) => {
            // do something with JSON
            pageRefOCSoil.set(JSONproductListOil);
            console.log('oil ocs')
            return;
        });

    let urlBestSellers = "https://www.ocs.ca/collections/" + 'best-sellers' + "/products.json";
    let pageRefOCSbestSellers = refOCSfull.child( 'bestSellers/' + dateToString);
    fetch(urlBestSellers, settings)
        .then(res => res.json())
        .then((JSONproductListBestSellers) => {
            // do something with JSON
            pageRefOCSbestSellers.set(JSONproductListBestSellers);
            console.log('best seller ocs')
            return;
        });
};

module.exports = getResults;
