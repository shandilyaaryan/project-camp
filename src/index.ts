import app from "./app";
import { connectDb } from "./db/db";
import { connectRedis } from "./utils";

const port = process.env.PORT || 8000;

const startserver = async () => {
  try {
    const redis = await connectRedis();
    if (!redis) {
      console.log("Cannot connect to redis");
    }
    await connectDb();
    app.listen(port, () =>
      console.log(`Hello there server is running on http://localhost:${port}`),
    );
  } catch (err) {
    console.error("Startup Failed: ", err);
    process.exit(1);
  }
};
startserver();
