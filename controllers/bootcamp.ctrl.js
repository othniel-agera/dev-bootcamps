const path = require("path");
const Bootcamp = require("../models/bootcamp.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const geocoder = require("../utils/geocoder");
class BootcampController {
	/**
	 * @desc Fetch bootcamps
	 * @route GET /api/v1/bootcamps
	 * @access Public
	 */
	fetchAll = asyncHandler(async (req, res) => {
		res.status(200).json(res.advancedResults);
	});

	/**
	 * @desc Fetch bootcamp
	 * @route GET /api/v1/bootcamps
	 * @access Public
	 */
	fetch = asyncHandler(async (req, res) => {
		const bootcamp = await Bootcamp.findById(req.params.id);
		if (!bootcamp)
			return next(
				new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
			);
		res.status(200).json({ success: true, data: bootcamp });
	});

	/**
	 * @desc Fetch bootcamp within a radius
	 * @route GET /api/v1/bootcamps/radius/:zipcode/:distance
	 * @access Private
	 */
	fetchWithinRadius = asyncHandler(async (req, res) => {
		const { zipcode, distance } = req.params;

		//Get lat/lng from geocoder;

		const loc = await geocoder.geocode(zipcode);
		const lat = loc[0].latitude;
		const lng = loc[0].longitude;

		// Calc radius using radians
		//Divide dist by radius of Earth
		// Earth Radius = 3,963mi / 6,378km
		const radius = distance / 3963;

		const bootcamps = await Bootcamp.find({
			location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
		});
		res.status(200).json({
			success: true,
			count: bootcamps.length,
			result: bootcamps,
		});
	});

	/**
	 * @desc Create bootcamps
	 * @route POST /api/v1/bootcamps
	 * @access Private
	 */
	create = asyncHandler(async (req, res) => {
		// Add user to req.body
		req.body.user = req.user;

		// Check for published bootcamp
		const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

		// If user not admin the can only add one boodcamp
		if (publishedBootcamp && req.user.role !== "admin") {
			return next(
				new ErrorResponse(
					`The user with Id ${req.user.id} has already published a bootcamp`,
					400
				)
			);
		}

		const bootcamp = await Bootcamp.create(req.body);
		res.status(201).json({ success: true, data: bootcamp });
	});

	/**
	 * @desc Update bootcamp
	 * @route PUT /api/v1/bootcamps/:id
	 * @access Private
	 */
	update = asyncHandler(async (req, res, next) => {
		const bootcamp = await Bootcamp.findById(req.params.id);
		if (!bootcamp)
			return next(
				new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
			);
		// Make sure user is bootcamp owner
		if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
			return next(
				new ErrorResponse(
					`User ${req.params.id} is not authorized to update this bootcamp`,
					401
				)
			);
		}

		bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(202).json({ success: true, data: bootcamp });
	});

	/**
	 * @desc Destroy bootcamp
	 * @route PUT /api/v1/bootcamps/:id
	 * @access Private
	 */
	destroy = asyncHandler(async (req, res) => {
		const bootcamp = await Bootcamp.findById(req.params.id);
		if (!bootcamp)
			return next(
				new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
			);
		// Make sure user is bootcamp owner
		if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
			return next(
				new ErrorResponse(
					`User ${req.params.id} is not authorized to update this bootcamp`,
					401
				)
			);
		}
		bootcamp.remove();
		res.status(202).json({ success: true, data: {} });
	});

	/**
	 * @desc Upload photo for bootcamp
	 * @route PUT /api/v1/bootcamps/:id/photo
	 * @access Private
	 */
	photoUpload = asyncHandler(async (req, res, next) => {
		const bootcamp = await Bootcamp.findById(req.params.id);
		if (!bootcamp)
			return next(
				new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
			);
		if (!req.files) {
			return next(new ErrorResponse(`Please upload a file`, 400));
		}
		const file = req.files.photo;
		if (!file.mimetype.startsWith("image")) {
			return next(new ErrorResponse(`Please upload an image file`, 400));
		}

		// Check file size
		if (file.size > process.env.MAX_FILE_UPLOAD)
			return next(
				new ErrorResponse(
					`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
					400
				)
			);
		// Create custom file name
		file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
		await file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`);

		// Make sure user is bootcamp owner
		if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
			return next(
				new ErrorResponse(
					`User ${req.params.id} is not authorized to update this bootcamp`,
					401
				)
			);
		}
		await Bootcamp.findByIdAndUpdate(req.params.id, {
			photo: file.name,
		});
		console.log(file);
		res.status(202).json({ success: true, data: bootcamp });
	});
}

module.exports = new BootcampController();
