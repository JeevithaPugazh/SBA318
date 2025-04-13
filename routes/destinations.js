const express = require("express");
const router = express.Router();
const activities = require("../data/activities");
const destinations = require("../data/destinations");
const reviews = require("../data/reviews");
const { title } = require("process");

//Get all destination data
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
//Get all destination data
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

//Get destination by id
router.get("/:id", (req, res, next) => {
  const selectedDestination = destinations.find(
    (d) => d.id === parseInt(req.params.id)
  );
  if (!selectedDestination) {
    return error(404, "Destination not found");
  }
  const destinationActivities = activities.filter(
    (a) => a.destinationId === selectedDestination.id
  );
  let filteredReviews = reviews.filter(
    (r) => r.destinationId === selectedDestination.id
  );

  const rating = parseInt(req.query.rating);
  if (!isNaN(rating)) {
    filteredReviews = filteredReviews.filter(
      (r) => r.rating === rating
    );
  }

  res.render("details", {
    ...selectedDestination,
    activities: destinationActivities,
    reviews: filteredReviews,
  });
});

//get reviews by destination id
router.get("/:id/reviews", (req, res, next) => {
  const links = [
    {
      href: "/api/destination/:id",
      rel: ":id",
      type: "GET",
    },
  ];
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
    res.json({ selectedRatingsComment, links });
  } else {
    res.json({ destinationReviews, links });
  }
});

router.delete("/:id/reviews", (req, res) => {
  const destinationId = parseInt(req.params.id);
  const rating = parseInt(req.query.rating);
  const destinationReviews = reviews.filter(
    (r) => r.destinationId === destinationId
  );
  if (!isNaN(rating)) {
    const selectedRatings = destinationReviews.filter(
      (d) => d.rating === rating
    );
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
