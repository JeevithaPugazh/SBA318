const express = require("express");
const router = express.Router();
const activities = require("../data/activities");
const destination = require("../data/destinations");
const reviews = require("../data/reviews")

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

router.get("/:id",(req,res)=>{
  const destination = destinations.find(d => d.id === parseInt(req.params.id));
  const destinationActivities = activities.filter(a=>a.destinationId === destination.id);
  const destinationReviews = reviews.filter(r => r.destinationId === destination.id);

  if(!destination){
    return res.status(404).send("Destination not found");
  }

  res.render("details",{
    title: `${destination.name}`,
    destination,
    activities: destinationActivities,
    reviews: destinationReviews,
  });
});

module.exports = router; 