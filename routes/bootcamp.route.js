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
const advancedResults = require("../middlewares/advancedResults");
const Bootcamp = require("../models/bootcamp.model");

const router = express.Router();

// Re-router courses
router.use("/:bootcampId/courses", coursesRouter);

router.route("/radius/:zipcode/:distance").get(fetchWithinRadius);
router
	.route("/")
	.get(advancedResults(Bootcamp, "courses"), fetchAll)
	.post(create);
router.route("/:id").get(fetch).put(update).delete(destroy);
router.route("/:id/photo").put(photoUpload);

module.exports = router;
