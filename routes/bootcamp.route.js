const express = require("express");
const {
	fetchAll,
	fetch,
	fetchWithinRadius,
	create,
	update,
	destroy,
	photoUpload,
} = require("../controllers/bootcamp.ctrl");
const coursesRouter = require("./course.route");
const reviewRouter = require("./review.route");
const advancedResults = require("../middlewares/advancedResults");
const Bootcamp = require("../models/bootcamp.model");
const { protect, authorize } = require("../middlewares/auth");

const router = express.Router();

// Re-router courses
router.use("/:bootcampId/courses", coursesRouter);
router.use("/:bootcampId/reviews", reviewRouter);

router.route("/radius/:zipcode/:distance").get(fetchWithinRadius);
router
	.route("/")
	.get(advancedResults(Bootcamp, "courses"), fetchAll)
	.post(protect, authorize("publisher", "admin"), create);
router
	.route("/:id")
	.get(fetch)
	.put(protect, authorize("publisher", "admin"), update)
	.delete(protect, authorize("publisher", "admin"), destroy);
router
	.route("/:id/photo")
	.put(protect, authorize("publisher", "admin"), photoUpload);

module.exports = router;
