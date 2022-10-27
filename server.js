const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const fileupload = require("express-fileupload");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");

//Route files
const bootcamps = require("./routes/bootcamp.route");
const courses = require("./routes/course.route");
const reviews = require("./routes/review.route");
const auths = require("./routes/auth.route");
const users = require("./routes/user.route");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");

//Load configs
dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// To remove data using these defaults:
app.use(mongoSanitize());
// Set security headers
app.use(helmet());
app.use(xss());
// Rate limiting
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 mins
	max: 100,
});
app.use(limiter);
app.use(hpp());
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/auth", auths);
app.use("/api/v1/users", users);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
	PORT,
	console.log(
		`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.magenta
			.bold
	)
);

//Handle unhandled rejections
process.on("unhandledRejection", (err, promise) => {
	console.log(`Error: ${err.message}`);
	// Close server & exit process
	server.close(() => process.exit(1));
});
