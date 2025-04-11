const express = require("express");
const router = express.Router();
const reviews = require("../data/reviews");

router.route("/").get((req,res)=>{
    const links = [
        {
          href: "reviews/:id",
          rel: ":id",
          type: "GET",
        },
      ];

      res.json({reviews, links});
})

module.exports = router; 