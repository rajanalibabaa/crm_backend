import app from "./app.js";
import connectDB from "./src/configs/db.js";

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
