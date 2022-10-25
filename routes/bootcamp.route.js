const express = require("express");
const {
	fetchAll,
	fetch,
	fetchWithinRadius,
	create,
	update,
	destroy,
} = require("../controllers/bootcamp.ctrl");
const coursesRouter = require("./course.route");

const router = express.Router();

// Re-router courses
router.use("/:bootcampId/courses", coursesRouter);

router.route("/radius/:zipcode/:distance").get(fetchWithinRadius);
router.route("/").get(fetchAll).post(create);
router.route("/:id").get(fetch).put(update).delete(destroy);

module.exports = router;
