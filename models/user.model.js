const mongoose = require("mongoose");
const bcrpyt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please add a name"],
	},
	email: {
		type: String,
		required: [true, "Please add an email"],
		unique: true,
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			"Please add a valid email",
		],
	},
	role: {
		type: String,
		enum: ["user", "publisher"],
		default: "user",
	},
	password: {
		type: String,
		required: [true, "Please add a password"],
		minlength: 6,
		select: false,
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	confirmEmailToken: String,
	isEmailConfirmed: {
		type: Boolean,
		default: false,
	},
	twoFactorCode: String,
	twoFactorCodeExpire: Date,
	twoFactorEnable: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

UserSchema.pre("save", async function (next) {
	const salt = await bcrpyt.genSalt(10);
	this.password = await bcrpyt.hash(this.password, salt);
});

module.exports = mongoose.model("User", UserSchema);
