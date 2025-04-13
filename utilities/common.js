const activities = require("../data/activities");
const destinations = require("../data/destinations");
const reviews = require("../data/reviews");
function getDestinationData(destinationId, updatedReviews) {
  const destination = destinations.find(
    (d) => d.id == destinationId
  );
  const filteredReviews = (
    updatedReviews || reviews
  ).filter((r) => r.destinationId == destinationId);
  const destinationActivities = activities.filter(
    (a) => a.destinationId == destinationId
  );
//   console.log(destinations);
  return {
    ...destination,
    activities: destinationActivities,
    reviews: filteredReviews,
  };
}
module.exports = getDestinationData;
