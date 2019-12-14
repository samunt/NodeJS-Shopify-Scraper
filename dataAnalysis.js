class Analysis {
    // ..and an (optional) custom class constructor. If one is
    // not supplied, a default constructor is used instead:
    // constructor() { }
    constructor() {
        let refOCSfull = db.ref("OCSfull/0");
        let refOCSbestSellers = db.ref("OCSbestSellers/0");
        let refBCfull = db.ref("BCfull/0");

    }
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
}

module.exports = Analysis;
