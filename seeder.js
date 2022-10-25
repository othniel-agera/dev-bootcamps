const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env
dotenv.config({ path: "./config/config.env" });

// Load models
const Bootcamp = require("./models/bootcamp.model");
const Course = require("./models/course.model");

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read the JSON files
const bootcamps = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);
const courses = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

// Import into DB
const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		await Course.create(courses);
		console.log(`Data imported...`.green.inverse);
		process.exit();
	} catch (error) {
		console.log(`${error}`.red);
	}
};

// Delete from DB
const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		await Course.deleteMany();
		console.log(`Data deleted...`.red.inverse);
		process.exit();
	} catch (error) {
		console.log(error.red);
	}
};

if (process.argv[2] === "-i") {
	importData();
} else if (process.argv[2] === "-d") {
	deleteData();
}
