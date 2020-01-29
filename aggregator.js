const fs = require('graceful-fs')
const json2xls = require('json2xls');
const _ = require('lodash');
const mathjs = require('mathjs');
const admin = require("firebase-admin");
const shouldDeleteData = false;
// this function is called second => from app.js
const aggregate = () => {

    let date = new Date()
    let db = admin.database();
    let metaStatsOCS = db.ref("metaStatsOCS");
    let dateToString = date.toString();


    // TO FETCH DIRECTORIES
    // db.ref('ONTARIO-OCS').once('value').then(function(snapshot) {
    //     let snap = snapshot.val();
    //     let xls = json2xls(snap);
    //     fs.writeFileSync('data.xlsx', xls, 'binary')
    //     console.log('done writing to xls')
    // });
    if (shouldDeleteData == true) {
        // TO DELETE DIRECTORIES
        db.ref('cartridgesFri\xa0Jan\xa017\xa02020\xa016:47:45\xa0GMT-0500\xa0(Eastern\xa0Standard\xa0Time)' ).remove().then(function(){
            console.log('--------------------deleted')
        }).catch(function(){
            console.log('--------------------not deleted')
        });
        db.ref('cartridgesFri Jan 17 2020 16:49:38 GMT-0500 (Eastern Standard Time)' ).remove().then(function(){
            console.log('--------------------deleted')
        }).catch(function(){
            console.log('--------------------not deleted')
        });
    }

    let preRollProductBreakdownArray = [];
    let dryBudProductBreakdownArray = [];
    let scrapeCapsules = () => {
        db.ref('ONTARIO-OCS/capsules').once('value').then(function(snapshot) {
            let allCapsules = snapshot.val();
            let arr = [];
            let capsuleArray = [];
            let model = {};
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

            capsuleArray.forEach((product) => {
                for (let i = 0; i < product.options[0].values.length; i++) {

                    // this is how we get the thc and cbd from the tags
                    let thc = _.filter(product.tags, (s) => {
                        return s.indexOf( 'thc_content_max' ) !== -1;
                    });
                    let cbd = _.filter(product.tags, (s) => {
                        return s.indexOf( 'cbd_content_max' ) !== -1;
                    });

                    model.productName       =  product.handle;
                    model.mgPerMlthc        =  null;
                    model.mgPerMlbd         =  null;
                    model.mgPerPreRollthc   =  null;
                    model.mgPerPreRollcbd   =  null;
                    model.mgTHCperPack      =  null;
                    model.mgCBDperPack      =  null;
                    model.brandName         =  product.vendor;
                    model.sku               =  product.variants[i].sku;

                    capsuleArray.push(model);

                    model = {};
                }
            });
            let pageRefCapsule = metaStatsOCS.child( 'capsuleStatisticsAsArrayOfProducts/' + dateToString);
            pageRefCapsule.set(preRollProductBreakdownArray);
            console.log('set capsule ============')

            // prepare for export to xls
            // let xls = json2xls(capsuleArray);
            // fs.writeFileSync('data.xlsx', xls, 'binary')
            // console.log('done writing to xls')
        })
    }

    let scrapeDryBud = () => {
        db.ref('ONTARIO-OCS/driedFlowerCannabis').once('value').then((snapshot) => {
            let allBud = snapshot.val();
            let arr = [];
            let budArray = [];
            let model = {};

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
                    }
                }
            }

            // get rid of duplicates
            budArray = _.uniqBy(budArray, 'id');
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

                    dryBudProductBreakdownArray.push(model);

                    model = {};

                }
            });
            let pageRefDryBud  = metaStatsOCS.child('dryBudStatisticsAsArrayOfProducts/' + dateToString);
            pageRefDryBud.set(dryBudProductBreakdownArray);
            console.log('set dry bud ============')
        });
    };

    let scrapePreRolls = () => {
        db.ref('ONTARIO-OCS/preRolled').once('value').then((snapshot) => {
            let allPreRolls = snapshot.val();
            let arr = [];
            let preRollArr = [];
            let model = {};

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
            // remove all duplicates
            preRollArr = _.uniqBy(preRollArr, 'id');

            // this is a function to find out how many grams in a pre roll by playing with the string
            function howManyGramsInPreRoll(str) {
                return str.split('*')[1];
            }

            preRollArr.forEach((product) => {
                for (let i = 0; i < product.options[0].values.length; i++) {

                    // this is how we get the thc and cbd from the tags
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
                    model.mgPerPreRollthc   =  (((model.thc) * 10) * (model.totalGramsPerPack / model.rollsPerPack));
                    model.mgPerPreRollcbd   =  ((model.cbd * 10) * (model.totalGramsPerPack / model.rollsPerPack));
                    model.mgTHCperPack      =  model.totalGramsPerPack * (model.thc * 10);
                    model.mgCBDperPack      =  model.totalGramsPerPack * (model.cbd * 10);;
                    model.brandName         =  product.vendor;
                    model.sku               =  product.variants[i].sku;
                    model.preRollSize       =  rollsEquation.includes('*') ? howManyGramsInPreRoll(rollsEquation) : rollsEquation;

                    // do a check for pre rolls with an issue
                    model.mgPerPreRollthc = isNaN(model.mgPerPreRollthc) ? null : model.mgPerPreRollthc;
                    model.mgPerPreRollcbd = isNaN(model.mgPerPreRollcbd) ? null : model.mgPerPreRollcbd;
                    model.mgTHCperPack    = isNaN(model.mgTHCperPack) ? null : model.mgTHCperPack;
                    model.mgCBDperPack    = isNaN(model.mgCBDperPack) ? null : model.mgCBDperPack;
                    preRollProductBreakdownArray.push(model);

                    model = {};
                }
            });
            let pageRefPreRoll = metaStatsOCS.child( 'preRollStatisticsAsArrayOfProducts/' + dateToString);
            pageRefPreRoll.set(preRollProductBreakdownArray);
            console.log('set pre roll ============')

        });
    };

    // -------------- PUSH DATA TO STATS DB ------------------
    // scrapeCapsules();
    scrapeDryBud(); // at the end of this function an array is filled which is what we push
    scrapePreRolls(); // at the end of this function an array is filled which is what we push
};

module.exports = aggregate;
