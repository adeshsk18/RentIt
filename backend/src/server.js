import cors from "cors";
import express from "express";
import path from "path";

import { initCloudinary } from "./config/cloudinaryConf.js";
import connectDatabase from "./config/database.js";
import { app, server } from "./config/socket.js";
import { errorHandler, notFound } from "./middlewares/error.js";
import { AdminRoute } from "./routes/admin.js";
import { AuthRoute } from "./routes/auth.js";
import { ListingsRoute } from "./routes/listing.js";
import { OwnerRoute } from "./routes/owner.js";
import { UserRoute } from "./routes/user.js";

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/auth", AuthRoute);

app.use("/admin", AdminRoute);
app.use("/owner", OwnerRoute);
app.use("/user", UserRoute);

app.use("/list", ListingsRoute);

//// for local multer storage
//
//import path from "path";
//import { root_directory } from "./lib/utils.js";
//app.use("/uploads", express.static(path.join(root_directory, "/uploads")));

const projectRootDir = path.resolve("..");

if (process.env.DEV_MODE) {
  app.get("/", (_, res) => {
    res.send("HRA-private-API-v0.1.0b1");
  });
} else {
  app.use(express.static(path.join(projectRootDir, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(projectRootDir, "frontend", "build", "index.html")
    );
  });
}

app.use(notFound);
app.use(errorHandler);

server.listen(PORT, () => {
  connectDatabase();
  initCloudinary();
  console.log(`Server is running on port ${PORT}`);
});
