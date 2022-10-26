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
const { protect, authorize } = require("../middlewares/auth");

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
	.post(protect, authorize("publisher", "admin"), create);
router
	.route("/:id")
	.get(fetch)
	.put(protect, authorize("publisher", "admin"), update)
	.delete(protect, authorize("publisher", "admin"), destroy);

module.exports = router;
