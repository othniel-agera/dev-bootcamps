const express = require("express");
const {
	fetchAll,
	fetch,
	create,
	update,
	destroy,
} = require("../controllers/course.ctrl");
const advancedResults = require("../middlewares/advancedResults");
const Course = require("../models/course.model");

const router = express.Router({ mergeParams: true });

router
	.route("/")
	.get(
		advancedResults(Course, {
			path: "bootcamp",
			select: "name description",
		}),
		fetchAll
	)
	.post(create);
router.route("/:id").get(fetch).put(update).delete(destroy);

module.exports = router;
