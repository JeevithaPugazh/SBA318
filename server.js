//server
const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const error = require("./utilities/error");
const destinations = require("./data/destinations");

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
const destinationRoutes = require("./routes/destinations");
const activitieRoutes = require("./routes/activities");
const reviewsRoutes = require("./routes/reviews");

app.use("/api/destinations", destinationRoutes);
app.use("/api/activities", activitieRoutes);
app.use("/api/reviews", reviewsRoutes);

app.get("/", (req, res) => {
  res.render("home", {
    title: "Travel Guide",
    destinations,
  });
});

//Adding HATEOAS links

app.get("/api", (req, res) => {
  res.json({
    links: [
      {
        href: "api/destinations",
        rel: "destination",
        type: "GET",
      },
      {
        href: "api/activities",
        rel: "activities",
        type: "GET",
      },
      {
        href: "api/reviews",
        rel: "reviews",
        type: "GET",
      },
    ],
  });
});

//404 middleware
app.use((req, res, next) => {
  next(error(404, "Resource Not found"));
});

//error-handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(
    `Server is running on http://localhost:${PORT}`
  );
});
