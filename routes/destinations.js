const express = require("express");
const router = express.Router();

const destination = require("../data/destinations");

router.get("/",(req,res)=>{
    const links = [
        {
          href: "destination/:id",
          rel: ":id",
          type: "GET",
        },
      ];

      res.json({destination, links});
})



module.exports = router; 