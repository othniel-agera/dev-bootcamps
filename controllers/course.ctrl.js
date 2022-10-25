const Course = require("../models/course.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const Bootcamp = require("../models/bootcamp.model");
class CourseController {
	/**
	 * @desc Fetch courses
	 * @route GET /api/v1/courses
	 * @route GET /api/v1/bootcamps/:bootcampId/courses
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
		if (req.params.bootcampId) {
			query = Course.find({
				bootcamp: req.params.bootcampId,
				...JSON.parse(queryStr),
			});
		} else {
			query = Course.find(JSON.parse(queryStr)).populate({
				path: "bootcamp",
				select: "name description",
			});
		}

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
		const total = await Course.countDocuments();
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
	 * @desc Fetch course
	 * @route GET /api/v1/courses/:id
	 * @access Public
	 */
	fetch = asyncHandler(async (req, res, next) => {
		const course = await Course.findById(req.params.id).populate({
			path: "bootcamp",
			select: "name description",
		});
		if (!course)
			return next(
				new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
			);
		res.status(200).json({ success: true, data: course });
	});

	/**
	 * @desc Create course
	 * @route POST /api/v1/bootcamps/:bootcampId/courses
	 * @access Private
	 */
	create = asyncHandler(async (req, res, next) => {
		req.body.bootcamp = req.params.bootcampId;
		const bootcamp = await Bootcamp.findById(req.params.bootcampId);
		if (!bootcamp)
			return next(
				new ErrorResponse(
					`Bootcamp not found with id of ${req.params.bootcampId}`,
					404
				)
			);
		const course = await Course.create(req.body);
		res.status(201).json({ success: true, data: course });
	});

	/**
	 * @desc Update course
	 * @route PUT /api/v1/courses/:id
	 * @access Private
	 */
	update = asyncHandler(async (req, res, next) => {
		let course = await Course.findById(req.params.id);
		if (!course)
			return next(
				new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
			);
		course = await Course.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		res.status(202).json({ success: true, data: course });
	});

	/**
	 * @desc Destroy bootcamp
	 * @route PUT /api/v1/courses/:id
	 * @access Private
	 */
	destroy = asyncHandler(async (req, res, next) => {
		let course = await Course.findById(req.params.id);
		if (!course)
			return next(
				new ErrorResponse(`Course not found with id of ${req.params.id}`, 404)
			);
		await course.remove();
		res.status(202).json({ success: true, data: {} });
	});
}

module.exports = new CourseController();
