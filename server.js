const app = require("./app");

// ℹ️ Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("TOKEN_SECRET:", process.env.TOKEN_SECRET);
