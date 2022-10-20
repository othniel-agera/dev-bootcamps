const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
//Route files
const bootcamps = require("./routes/bootcamp.route");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");

//Load configs
dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// Mount routers
app.use("/api/v1/bootcamps", bootcamps);

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
