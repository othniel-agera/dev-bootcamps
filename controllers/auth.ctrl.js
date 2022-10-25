const User = require("../models/user.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

class AuthController {
	/**
	 * @desc Register user
	 * @route POST /api/vi/auth/register
	 * @access Public
	 */
	register = asyncHandler(async (req, res, next) => {
		const { name, email, password, role } = req.body;

		// Create user
		const user = await User.create({
			name,
			email,
			password,
			role,
		});
		res.status(200).json({ success: true, user });
	});
}

module.exports = new AuthController();
