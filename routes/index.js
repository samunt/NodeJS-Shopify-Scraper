const express = require("express");
const router = express.Router();
const getResults = require("../scraper");
// getResults();
/* GET home page. */
// (async function() {
//   const result = await getResults();
// })();
router.get("/", async function(req, res, next) {
  const result = await getResults();
});
module.exports = router;
