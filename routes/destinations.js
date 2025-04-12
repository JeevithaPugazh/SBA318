const express = require("express");
const router = express.Router();
const activities = require("../data/activities");
const destinations = require("../data/destinations");
const reviews = require("../data/reviews");
const { title } = require("process");

router.get("/", (req, res) => {
  const links = [
    {
      href: "destination/:id",
      rel: ":id",
      type: "GET",
    },
  ];

  res.json({ destinations, links });
});

router.get("/:id", (req, res) => {
  const selectedDestination = destinations.find(
    (d) => d.id === parseInt(req.params.id)
  );
  const destinationActivities = activities.filter(
    (a) => a.destinationId === selectedDestination.id
  );
  let filteredReviews = reviews.filter(
    (r) => r.destinationId === selectedDestination.id
  );

  if (!selectedDestination) {
    return res.status(404).send("Destination not found");
  }

  res.render("details", {
    id: `${selectedDestination.id}`,
    title: `${selectedDestination.name}`,
    image: `${selectedDestination.image}`,
    description: `${selectedDestination.description}`,
    activities: destinationActivities,
    reviews: filteredReviews,
  });
});

router.post("/:id/activity", (req, res) => {
  const newActivity = {
    id: activities.length + 1,
    destinationId: parseInt(req.params.id),
    activity: req.body.activity,
  };
  activities.push(newActivity);
  res.redirect(`/${req.params.id}`);
});

//get reviews by destination id
router.get("/:id/reviews", (req, res, next) => {
  const destinationId = parseInt(req.params.id);
  const rating = parseInt(req.query.rating);

  const destinationReviews = reviews.filter(
    (r) => r.destinationId === destinationId
  );

  if (!isNaN(rating)) {
    const selectedRatings = destinationReviews.filter(
      (d) => d.rating === rating
    );
    const selectedRatingsComment = selectedRatings.map(
      (c) => c.comment
    );
    res.json(selectedRatingsComment);
  } else {
    res.json(destinationReviews);
  }
});

//filter reviews by rating
// router.get("/:id/reviews/:rating", (req, res, next) => {
//   const destinationId = parseInt(req.params.id);
//   const rating = parseInt(req.params.rating);
//   const destinationReviews = reviews.filter(
//     (r) => r.destinationId === destinationId
//   );
//   const selectedRating = destinationReviews.filter(
//     (d) => d.rating == rating
//   );
//   res.json(selectedRating);
// });
module.exports = router;
