const express = require("express");
const {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
} = require("../controllers/user.ctrl");
const advancedResults = require("../middlewares/advancedResults");
const { protect, authorize } = require("../middlewares/auth");
const User = require("../models/user.model");

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
