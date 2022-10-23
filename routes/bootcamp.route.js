const express = require("express");
const router = express.Router();
const {
	fetchAll,
	fetch,
	fetchWithinRadius,
	create,
	update,
	destroy,
} = require("../controllers/bootcamp.ctrl");

router.route("/radius/:zipcode/:distance").get(fetchWithinRadius);
router.route("/").get(fetchAll).post(create);
router.route("/:id").get(fetch).put(update).delete(destroy);

module.exports = router;
