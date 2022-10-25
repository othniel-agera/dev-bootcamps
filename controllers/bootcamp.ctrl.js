const path = require("path");
const Bootcamp = require("../models/bootcamp.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const geocoder = require("../utils/geocoder");
const { find } = require("../models/bootcamp.model");
class BootcampController {
	/**
	 * @desc Fetch bootcamps
	 * @route GET /api/vi/bootcamps
	 * @access Public
	 */
	fetchAll = asyncHandler(async (req, res) => {
		let query;

		// Copy req.query
		const reqQuery = { ...req.query };

		// Fields to exclude
		const removeFields = ["select", "sort", "page", "limit"];

		// Loop over removeFields and delete them from reqQuery
		removeFields.forEach((param) => delete reqQuery[param]);

		// Create query string
		let queryStr = JSON.stringify(reqQuery);

		// Create operators ( $gt, $gte, etc)
		queryStr = queryStr.replace(
			/\b(gt|gte|lt|lte|in)\b/g,
			(match) => `$${match}`
		);

		// Finding resource
		query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");

		// Select fields
		if (req.query.select) {
			const fields = req.query.select.split(",").join(" ");
			query = query.select(fields);
		}

		// Sort
		if (req.query.sort) {
			const sortBy = req.query.sort.split(",").join(" ");
			query = query.sort(sortBy);
		} else {
			query = query.sort("-createdAt");
		}

		// Pagination
		const page = parseInt(req.query.page, 10) || 1;
		const limit = parseInt(req.query.limit, 10) || 25;
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		const total = await Bootcamp.countDocuments();
		query = query.skip(startIndex).limit(limit);

		const bootcamps = await query.exec();

		// Pagination result
		const pagination = {};
		if (endIndex < total) {
			pagination.next = {
				page: page + 1,
				limit,
			};
		}
		if (startIndex > 0) {
			pagination.prev = {
				page: page - 1,
				limit,
			};
		}
		res.status(200).json({
			success: true,
			count: bootcamps.length,
			pagination,
			data: bootcamps,
		});
	});

	/**
	 * @desc Fetch bootcamp
	 * @route GET /api/vi/bootcamps
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
	 * @route GET /api/vi/bootcamps/radius/:zipcode/:distance
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
	 * @route POST /api/vi/bootcamps
	 * @access Public
	 */
	create = asyncHandler(async (req, res) => {
		const bootcamp = await Bootcamp.create(req.body);
		res.status(201).json({ success: true, data: bootcamp });
	});

	/**
	 * @desc Update bootcamp
	 * @route PUT /api/vi/bootcamps/:id
	 * @access Public
	 */
	update = asyncHandler(async (req, res) => {
		const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!bootcamp) res.status(404).json({ success: false });
		res.status(202).json({ success: true, data: bootcamp });
	});

	/**
	 * @desc Destroy bootcamp
	 * @route PUT /api/vi/bootcamps/:id
	 * @access Public
	 */
	destroy = asyncHandler(async (req, res) => {
		const bootcamp = await Bootcamp.findById(req.params.id);
		if (!bootcamp)
			return next(
				new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
			);
		bootcamp.remove();
		res.status(202).json({ success: true, data: {} });
	});

	/**
	 * @desc Upload photo for bootcamp
	 * @route PUT /api/vi/bootcamps/:id/photo
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

		await Bootcamp.findByIdAndUpdate(req.params.id, {
			photo: file.name,
		});
		console.log(file);
		res.status(202).json({ success: true, data: bootcamp });
	});
}

module.exports = new BootcampController();
