const Bootcamp = require("../models/bootcamp.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
class BootcampController {
	/**
	 * @desc Fetch bootcamps
	 * @route GET /api/vi/bootcamps
	 * @access Public
	 */
	fetchAll = asyncHandler(async (req, res, next) => {
		const bootcamps = await Bootcamp.find({});
		res.status(200).json({ success: true, data: bootcamps });
		// ;
	});

	/**
	 * @desc Fetch bootcamp
	 * @route GET /api/vi/bootcamps
	 * @access Public
	 */

	fetch = asyncHandler(async (req, res, next) => {
		const bootcamp = await Bootcamp.findById(req.params.id);
		if (!bootcamp)
			return next(
				new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
			);
		res.status(200).json({ success: true, data: bootcamp });
	});
	/**
	 * @desc Create bootcamps
	 * @route POST /api/vi/bootcamps
	 * @access Public
	 */
	create = asyncHandler(async (req, res, next) => {
		const bootcamp = await Bootcamp.create(req.body);
		res.status(201).json({ success: true, data: bootcamp });
	});

	/**
	 * @desc Update bootcamp
	 * @route PUT /api/vi/bootcamps/:id
	 * @access Public
	 */
	update = asyncHandler(async (req, res, next) => {
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
	destroy = asyncHandler(async (req, res, next) => {
		const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
		if (!bootcamp) res.status(404).json({ success: false });
		res.status(202).json({ success: true, data: {} });
	});
}

module.exports = new BootcampController();
