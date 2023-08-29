import mongoose from "mongoose";
import app from "./app.js";
const { DATABASE_URL } = process.env;
const port = process.env.PORT || 5000;

mongoose.connection.on("error", (err) => {
  logger.error(`Mongodb connection error : ${err}`);
  process.exit(1);
});

if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}

mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to Mongodb.");
  });
let server;

server = app.listen(port, () => {
  console.log(`Server is listening at ${port}.`);
});

//handle server errors
const exitHandler = () => {
  if (server) {
    console.log("Server closed.");
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  console.log(error);
  exitHandler();
};
process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

//SIGTERM
process.on("SIGTERM", () => {
  if (server) {
    console.log("Server closed.");
    process.exit(1);
  }
});
