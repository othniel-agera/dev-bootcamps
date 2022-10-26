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
		// Finding resource
		if (req.params.bootcampId) {
			const courses = await Course.find({
				bootcamp: req.params.bootcampId,
				...JSON.parse(queryStr),
			});
			res.status(200).json({
				success: true,
				count: courses.length,
				data: courses,
			});
		} else {
			res.status(200).json(res.advancedResults);
		}
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
		req.body.user = req.user;

		const bootcamp = await Bootcamp.findById(req.params.bootcampId);
		if (!bootcamp)
			return next(
				new ErrorResponse(
					`Bootcamp not found with id of ${req.params.bootcampId}`,
					404
				)
			);
		// Make sure user is bootcamp owner
		if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
			return next(
				new ErrorResponse(
					`User ${req.params.id} is not authorized to add course to this bootcamp ${req.params.bootcampId}`,
					401
				)
			);
		}
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
		// Make sure user is course owner
		if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
			return next(
				new ErrorResponse(
					`User ${req.params.id} is not authorized to update this course`,
					401
				)
			);
		}
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
		// Make sure user is course owner
		if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
			return next(
				new ErrorResponse(
					`User ${req.params.id} is not authorized to delete this course`,
					401
				)
			);
		}
		await course.remove();
		res.status(202).json({ success: true, data: {} });
	});
}

module.exports = new CourseController();
