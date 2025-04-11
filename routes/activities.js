const express = require("express");
const router = express.Router();
const error = require("../utilities/error");
const activities = require("../data/activities");
const destinations = require("../data/destinations");

router
  .route("/")
  .get((req, res) => {
    const links = [
      {
        href: "activities/:id",
        rel: ":id",
        type: "GET",
      },
    ];

    res.json({ activities, links });
  })
  .post((req, res, next) => {
    console.log("Received POST body:", req.body);
    if (
      req.body.destinationId &&
      req.body.activity &&
      req.body.description
    ) {
      const match = destinations.find(
        (d) => d.id === Number(req.body.destinationId)
      );
      if (!match) {
        return next(error(404, "Destination not found"));
      }
      const newActivity = {
        id: activities[activities.length - 1]?.id + 1 || 1,
        destinationId: req.body.destinationId,
        activity: req.body.activity,
        description: req.body.description,
      };
      activities.push(newActivity);
      res.status(201).json(newActivity);
      console.log(req.body);
    } else return next(error(400, "Insufficient Data"));
  });

module.exports = router;
