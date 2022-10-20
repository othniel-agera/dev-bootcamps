const Bootcamp = require("../models/bootcamp.model");
const ErrorResponse = require("../utils/errorResponse");
class BootcampController {
	/**
	 * @desc Fetch bootcamps
	 * @route GET /api/vi/bootcamps
	 * @access Public
	 */
	async fetchAll(req, res, next) {
		try {
			const bootcamps = await Bootcamp.find({});
			res.status(200).json({ success: true, data: bootcamps });
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @desc Fetch bootcamp
	 * @route GET /api/vi/bootcamps
	 * @access Public
	 */

	async fetch(req, res, next) {
		try {
			const bootcamp = await Bootcamp.findById(req.params.id);
			if (!bootcamp)
				return next(
					new ErrorResponse(
						`Bootcamp not found with id of ${req.params.id}`,
						404
					)
				);
			res.status(200).json({ success: true, data: bootcamp });
		} catch (error) {
			next(error);
		}
	}
	/**
	 * @desc Create bootcamps
	 * @route POST /api/vi/bootcamps
	 * @access Public
	 */
	async create(req, res, next) {
		try {
			const bootcamp = await Bootcamp.create(req.body);
			res.status(201).json({ success: true, data: bootcamp });
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @desc Update bootcamp
	 * @route PUT /api/vi/bootcamps/:id
	 * @access Public
	 */
	async update(req, res, next) {
		try {
			const bootcamp = await Bootcamp.findByIdAndUpdate(
				req.params.id,
				req.body,
				{
					new: true,
					runValidators: true,
				}
			);
			if (!bootcamp) res.status(404).json({ success: false });
			res.status(202).json({ success: true, data: bootcamp });
		} catch (error) {
			next(error);
		}
	}

	/**
	 * @desc Destroy bootcamp
	 * @route PUT /api/vi/bootcamps/:id
	 * @access Public
	 */
	async destroy(req, res, next) {
		try {
			const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
			if (!bootcamp) res.status(404).json({ success: false });
			res.status(202).json({ success: true, data: {} });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new BootcampController();