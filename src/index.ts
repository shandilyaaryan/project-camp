import app from "./app";
import { connectDb } from "./db/db";

const port = process.env.PORT || 8000;

const startserver = async () => {
  try{
    await connectDb();
    app.listen(port, () =>
      console.log(`Hello there server is running on http://localhost:${port}`),
    );
  } catch {
    console.error("Something went wrong!!")
  }
}
startserver();