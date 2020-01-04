const fetch = require('node-fetch');
const admin = require("firebase-admin");
const fs = require('graceful-fs')
const json2xls = require('json2xls');
const _ = require('lodash');
const mathjs = require('mathjs');
const date = new Date();
const shouldRunScraper = false; // SET THIS TO FALSE TO MAKE DATABASE MODIFICATIONS. IF TRUE YOU ARE RUNNING THE SCRAPER AS NORMAL
let settings = { method: "Get" };
// this function is called first => from app.js
const getResults = async () => {
    // Get a database reference to our blog
    let db = admin.database();
    // create db path reference
    let refOCSfull = db.ref("ONTARIO-OCS");
    let refBCfull = db.ref("BC-BCCS");
    let dateToString = date.toString();



    if (shouldRunScraper === true) {

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
        // let refArray = [refOCSfull, refBCfull]
        //
        // for (let index = 0; index < refArray.length; j++) {
        //     let pageRef = refArray[index].child()
        //     for (let i = 0; i < urlArray.length; i++) {
        //
        //     }
        // };

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
        // db.ref('ONTARIO-OCS/' ).remove().then(function(){
        //     console.log('ON deleted')
        // }).catch(function(){
        //     console.log('ON not deleted')
        // });
        // TO FETCH DIRECTORIES
        // db.ref('ONTARIO-OCS').once('value').then(function(snapshot) {
        //     let snap = snapshot.val();
        //     let xls = json2xls(snap);
        //     fs.writeFileSync('data.xlsx', xls, 'binary')
        //     console.log('done writing to xls')
        // });


        // we need to take  db.ref('ONTARIO-OCS').once
        let scrapeCapsules = () => {
            db.ref('ONTARIO-OCS/capsules').once('value').then(function(snapshot) {
                let allCapsules = snapshot.val();
                let arr = [];
                let capsuleArray = [];

                // load all the capsule stuff into an array
                for (let i = 0; i < Object.keys(allCapsules).length; i++) { // number of dates in the collection
                    let date = Object.keys(allCapsules)[i];
                    arr.push(allCapsules[date])
                }
                // flatten out the array
                arr = arr.flatMap(({products}) => products);
                for (let i = 0; i < arr.length; i++) {
                    let tags = arr[i].tags;
                    for (let j = 0; j < tags.length; j++) {
                        if (tags[j].includes("Capsules")) {
                            capsuleArray.push(arr[i]);
                        }
                    }
                }
                // get rid of duplicates
                capsuleArray = _.uniqBy(capsuleArray, 'id');


                // prepare for export to xls
                // let xls = json2xls(capsuleArray);
                // fs.writeFileSync('data.xlsx', xls, 'binary')
                // console.log('done writing to xls')
            })
        }

        let scrapePreRolls = () => {
            db.ref('ONTARIO-OCS/preRolled').once('value').then((snapshot) => {
                let allPreRolls = snapshot.val();
                let arr = [];
                let preRollArr = [];
                let model = {};
                let productBreakdownArray = [];

                // load all the pre roll stuff into an array
                for (let i = 0; i < Object.keys(allPreRolls).length; i++) { // number of dates in the collection
                    let date = Object.keys(allPreRolls)[i];
                    arr.push(allPreRolls[date])
                }
                // flatten out the array
                arr = arr.flatMap(({products}) => products);
                for (let i = 0; i < arr.length; i++) {
                    let tags = arr[i].tags;

                    for (let j = 0; j < tags.length; j++) {

                        if (tags[j].includes("Pre-Rolled")) {
                            preRollArr.push(arr[i]);
                        }
                    }
                }

                preRollArr = _.uniqBy(preRollArr, 'id');
                function getSecondPart(str) {
                    return str.split('*')[1];
                }
                preRollArr.forEach((product) => {
                    for (let i = 0; i < product.options[0].values.length; i++) {

                        let thc = _.filter(product.tags, (s) => {
                            return s.indexOf( 'thc_content_max' ) !== -1;
                        });
                        let cbd = _.filter(product.tags, (s) => {
                            return s.indexOf( 'cbd_content_max' ) !== -1;
                        });
                        // rollsEquation is actually either just the grams of the 1 joint in the pack, like 0.5g
                        // or it is an equation like 4*0.5 meaning that is has 2g per pack
                        let rollsEquation = (product.options[0].values[i].slice(0, -1)).replace('x', '*');
                        let gramsPerPack = rollsEquation.includes('*') ? mathjs.evaluate(rollsEquation) : rollsEquation;

                        model.thc               =  thc[0].replace("thc_content_max--", "");
                        model.cbd               =  cbd[0].replace("cbd_content_max--", "");
                        model.totalGramsPerPack =  gramsPerPack;
                        model.productName       =  product.handle;
                        model.rollsPerPack      =  rollsEquation.includes('*') ? parseInt(rollsEquation.substring(0, rollsEquation.indexOf('*'))) : 1;
                        model.mgPerGthc         =  (model.thc * 10);
                        model.mgPerGcbd         =  (model.cbd * 10);
                        model.mgPerPreRollthc   =  ((model.thc * 10) * (model.totalGramsPerPack / model.rollsPerPack));
                        model.mgPerPreRollcbd   =  ((model.cbd * 10) * (model.totalGramsPerPack / model.rollsPerPack));
                        model.mgTHCperPack      =  model.totalGramsPerPack * (model.thc * 10);
                        model.mgCBDperPack      =  model.totalGramsPerPack * (model.cbd * 10);;
                        model.brandName         =  product.vendor;
                        model.sku               =  product.variants[i].sku;
                        model.preRollSize       =  rollsEquation.includes('*') ? getSecondPart(rollsEquation) : rollsEquation;

                        productBreakdownArray.push(model);

                        model = {};

                    }
                });
                console.log(productBreakdownArray);


            });
        };

        let scrapeDryBud = () => {
            db.ref('ONTARIO-OCS/driedFlowerCannabis').once('value').then((snapshot) => {
                let allBud = snapshot.val();
                let arr = [];
                let budArray = [];

                // load all the dry bud stuff into an array
                for (let i = 0; i < Object.keys(allBud).length; i++) { // number of dates in the collection
                    let date = Object.keys(allBud)[i];
                    arr.push(allBud[date])
                }
                // flatten out the array
                arr = arr.flatMap(({products}) => products);
                for (let i = 0; i < arr.length; i++) {
                    let tags = arr[i].tags;

                    for (let j = 0; j < tags.length; j++) {

                        if (tags[j].includes("Dried Flower")) {
                            budArray.push(arr[i]);
                            console.log("push")
                        }
                    }
                }
                // console.log(budArray);

                // get rid of duplicates
                budArray = _.uniqBy(budArray, 'id');
                let model = {
                    productName: null,
                    gramsPerBottle: null,
                    thc: null,
                    cbd: null,
                    mgPerGthc: null,
                    mgPerGcbd: null,
                    mgTHCperBottle: null,
                    mgCBDperBottle: null,
                    brandName: null,
                    sku: null
                };
                let productBreakdownArray = []
                budArray.forEach((product) => {
                    for (let i = 0; i < product.options[0].values.length; i++) {

                        let thc = _.filter(product.tags, (s) => {
                            return s.indexOf( 'thc_content_max' ) !== -1;
                        });
                        let cbd = _.filter(product.tags, (s) => {
                            return s.indexOf( 'cbd_content_max' ) !== -1;
                        });

                        model.thc            =  thc[0].replace("thc_content_max--", "");
                        model.cbd            =  cbd[0].replace("cbd_content_max--", "");
                        model.productName    =  product.handle;
                        model.gramsPerBottle =  product.options[0].values[i].slice(0, -1);
                        model.mgPerGthc      =  (model.thc * model.gramsPerBottle);
                        model.mgPerGcbd      =  (model.cbd * model.gramsPerBottle);
                        model.mgTHCperBottle =  (model.mgPerGthc * model.gramsPerBottle);
                        model.mgCBDperBottle =  (model.mgPerGcbd * model.gramsPerBottle);
                        model.brandName      =  product.vendor;
                        model.sku            =  product.variants[i].sku;

                        productBreakdownArray.push(model);

                    }
                });
            })

        };

        // scrapeCapsules();
        // scrapeDryBud();
        scrapePreRolls();


    };
    return;
};

module.exports = getResults;
