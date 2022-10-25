const express = require("express");
const {
	fetchAll,
	fetch,
	create,
	update,
	destroy,
} = require("../controllers/course.ctrl");

const router = express.Router({ mergeParams: true });

router.route("/").get(fetchAll).post(create);
router.route("/:id").get(fetch).put(update).delete(destroy);

module.exports = router;
