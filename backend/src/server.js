import connectDB from "./database/connectDB.js";
import app from "./app.js";

connectDB();

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is serving at ${port}`);
});
