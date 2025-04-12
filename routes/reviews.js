const express = require("express");
const router = express.Router();
const error = require("../utilities/error");
let reviews = require("../data/reviews");

// GET all reviews or filter by destinationId and rating
router.get("/", (req, res) => {
  // let filteredReviews = reviews;

  // if (req.query.destinationId) {
  //   filteredReviews = filteredReviews.filter(
  //     (r) => r.destinationId === parseInt(req.query.destinationId)
  //   );
  // }

  // if (req.query.rating) {
  //   filteredReviews = filteredReviews.filter(
  //     (r) => r.rating === parseInt(req.query.rating)
  //   );
  // }

  const links = [
    {
      href: "reviews/:id",
      rel: ":id",
      type: "GET",
    },
  ];

  res.json({ reviews, links });
});

// Add a new review
router.post("/", (req, res) => {
  const { destinationId, rating, comment } = req.body;

  if (!destinationId || !rating || !comment) {
    return res
      .status(400)
      .json({ error: "Incomplete review data" });
  }

  const newReview = {
    id: reviews.length + 1,
    destinationId: parseInt(destinationId),
    rating: parseInt(rating),
    comment,
  };

  reviews.push(newReview);
  res.status(201).json(newReview);
});

//get reviews by id
router.get("/:id",
  (req, res, next) => {
    const reviewId = parseInt(req.params.id);
    const review = reviews.find((r) => r.id == reviewId);

    if (review) res.json(review);
    else next();
  });

// Update a review (PATCH)
router.patch("/:id", (req, res) => {
  const reviewId = parseInt(req.params.id);
  const review = reviews.find((r) => r.id === reviewId);

  if (!review)
    return res
      .status(404)
      .json({ error: "Review not found" });

  const { rating, comment } = req.body;

  if (rating !== undefined)
    review.rating = parseInt(rating);
  if (comment !== undefined) review.comment = comment;

  res.json(review);
});

// Delete a review
router.delete("/:id", (req, res) => {
  const reviewId = parseInt(req.params.id);
  const index = reviews.findIndex((r) => r.id === reviewId);

  if (index === -1)
    return res
      .status(404)
      .json({ error: "Review not found" });

  reviews.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
