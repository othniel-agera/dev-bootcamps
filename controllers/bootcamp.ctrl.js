class BootcampController {
	/**
	 * @desc Fetch bootcamps
	 * @route GET /api/vi/bootcamps
	 * @access Public
	 */
	async fetchAll(req, res) {
		res.status(200).json({ success: true, msg: "Show all bootcamps" });
	}

	/**
	 * @desc Fetch bootcamp
	 * @route GET /api/vi/bootcamps
	 * @access Public
	 */

	async fetch(req, res) {
		res
			.status(200)
			.json({ success: true, msg: `Show bootcamp ${req.params.id}` });
	}
	/**
	 * @desc Create bootcamps
	 * @route POST /api/vi/bootcamps
	 * @access Public
	 */
	async create(req, res) {
		res.status(200).json({ success: true, msg: "Create new bootcamp" });
	}

	/**
	 * @desc Update bootcamp
	 * @route PUT /api/vi/bootcamps/:id
	 * @access Public
	 */
	async update(req, res) {
		res
			.status(200)
			.json({ success: true, msg: `Update bootcamp ${req.params.id}` });
	}

	/**
	 * @desc Destroy bootcamp
	 * @route PUT /api/vi/bootcamps/:id
	 * @access Public
	 */
	async destroy(req, res) {
		res
			.status(200)
			.json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
	}
}

module.exports = new BootcampController();
