const express = require("express");
const router = express.Router();
const error = require("../utilities/error");
let reviews = require("../data/reviews");
const destinations = require("../data/destinations"); 

// GET all reviews or filter by destinationId and rating
router.get("/", (req, res) => {
  const destination = parseInt(req.query.destination);
  let filteredReviews = reviews;
  const links = [
    {
      href: "/api/reviews/:id",
      rel: ":id",
      type: "GET",
    },
  ];
  if (req.query.rating) {
    filteredReviews = filteredReviews.filter(
      (r) => r.rating === parseInt(req.query.rating)
    );
  }
  if (destination) {
    const destinationReviews = reviews.filter(
      (r) => r.destinationId == destination
    );
    res.json({ destinationReviews, links });
  } else {
    res.json({ reviews, links });
  }
});

// Add a new review
router.post("/", (req, res) => {
  const links = [
    {
      href: "/api/destinations/:id",
      rel: ":id",
      type: "GET",
    },
  ];
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
  if (parseInt(req.params.id)) {
    reviews = reviews.filter(
      (r) => r.destinationId === parseInt(req.params.id)
    );
  }

  reviews.push(newReview);
  res
    .status(201)
    .redirect(`/api/destinations/${destinationId}/reviews`);
});

//get reviews by id
router.get("/:id", (req, res, next) => {
  const reviewId = parseInt(req.params.id);

  const review = reviews.filter(
    (r) => r.id == reviewId
  );
  if (review) {
    res.json(review);
  } else next();
});
//////////

// Show Edit Form
router.get("/:id/edit", (req, res) => {
  const reviewId = parseInt(req.params.id);
  const review = reviews.find((r) => r.id === reviewId);

  if (!review) {
    return res
      .status(404)
      .json({ error: "Resource Not found" });
  }
  // res.json({ message: "This would be the edit form", review });
  res.render("editView", { review });
});

// Handle patch (Update)
router.patch("/:id", (req, res) => {
  const reviewId = parseInt(req.params.id);
  const { rating, comment } = req.body;

  const reviewIndex = reviews.findIndex(
    (r) => r.id === reviewId
  );

  if (reviewIndex === -1) {
    return res
      .status(404)
      .json({ error: "Review not found" });
  }

  if (rating)
    reviews[reviewIndex].rating = parseInt(rating);
  if (comment) reviews[reviewIndex].comment = comment;

  const destinationId = reviews[reviewIndex].destinationId;

  res.redirect(`/api/destinations/${destinationId}`);
});

// Handle DELETE
router.delete("/:id", (req, res,next) => {
  const reviewId = parseInt(req.params.id);
  const review = reviews.find((r) => r.id === reviewId);
  if(!review){
    return error(404,"Review not found")
  }
  const destinationId = review.destinationId
  const links = [
    {
      href: "/api/reviews/:destinationId",
      rel: ":id",
      type: "GET",
    },
  ];
  
  const index = reviews.findIndex((r) => r.id === reviewId);
  if (index !== -1) {
    reviews.splice(index, 1);
  }
  
 
  res.redirect(`/api/reviews?destination=${destinationId}`);
});
//////////////////////////////////////////////////////////

module.exports = router;
