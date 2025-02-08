const express = require("express");
const server = express();
server.use(express.json()); // for converting data into json format

const cors = require("cors");

server.use(cors()); //cors for cross origin access
const detenv = require("dotenv").config();
const PORT = process.env.PORT || 5500;
const connection = require("./config/db");

const userRouter = require("./routes/user.route");
server.use("/api/user", userRouter);

const projectRouter = require("./routes/project.route");
server.use("/api/project", projectRouter);

server.listen(PORT, async () => {
  try {
    await connection;
    console.log(`server is running on PORT: ${PORT} and db has been connected`);
  } catch (error) {
    console.log(error.message);
  }
});
