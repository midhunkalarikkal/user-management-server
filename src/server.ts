import "dotenv/config";
import app from "./app.js";

const PORT = Number(process.env.PORT ?? 5000);

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const shutdown = () => {
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
