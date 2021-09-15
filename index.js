const conToMongo = require("./db");
const express = require("express");
conToMongo();
const app = express();
const port = 5000;

app.use(express.json());
//Available Routes
app.use("/api/auth", require("./routes/auth"));
// app.use("/api/auth", require("./routes/notes"));
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
//nodemon .\index.js
