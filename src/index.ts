import express from "express";

const app = express();
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello there")
});

app.listen(port, () => console.log(`Hello there server is running on http://localhost:${port}`));
