// import express
const express = require("express");
// init express router
const router = express.Router();
// import UserController
const UserController = require("../controllers/UserController");
const ClassController = require("../controllers/ClassController");

// import validate post
const { validateUser } = require("../utils/validators");
const multer = require("multer");
const app = express();
const http = require("http");
const server = http.createServer(app);
const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });
// Profile start
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Mengambil ekstensi dari file asli
    const ext = path.extname(file.originalname);
    // Menyimpan file dengan nama unik + ekstensi
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage: storage });

// Store WebSocket connections
const clients = new Map();

// WebSocket connection
wss.on("connection", (ws, req) => {
  const userId = req.url.split("/").pop();
  clients.set(userId, ws);

  ws.on("close", () => {
    clients.delete(userId);
  });
});

// define route for users
router.get("/users", UserController.findUsers);
router.get("/class", ClassController.findClass);

// define route for create user
router.post("/register", validateUser, UserController.createUser);
// validateUsers di atas digunakan untuk menghandle validasi dari request yang dikirimkan.

// define route for login
router.post("/login", UserController.login); // Menambahkan route untuk login

// define route for count all collections
router.get("/count-collections", UserController.countCollections);

// defien route for create new user
router.post("/create-user", UserController.createUser);

// define route for edit user
router.put("/edit-user/:id", UserController.updateUser);

//  define router for delete user
router.delete("/delete-user/:id", UserController.deleteUser);

// Profile start
// Upload endpoint
router.post(
  "/upload",
  upload.single("profilePicture"),
  UserController.uploadProfilePicture
);
// Profile end

// export router
module.exports = router;

// define route for get post by id
// router.get("/users/:id", UserController.fundPostbyId);

// define router for updatePost
// router.put("/users/:id", UserController.updatePost);

// export router
// module.exports = router;
