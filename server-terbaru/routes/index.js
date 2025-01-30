const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const ClassController = require("../controllers/ClassController");
const MaterialController = require("../controllers/MaterialController");
const QuizController = require("../controllers/QuizController");
const { validateUser } = require("../utils/validators");
const multer = require("multer");
// const upload = multer();
// const path = require("path");
const WebSocket = require("ws");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware untuk menangani form-data dengan file
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Multer Storage Configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${Date.now()}${ext}`);
//   },
// });

// const upload = multer({ storage: storage });

// WebSocket Configuration
const clients = new Map();

wss.on("connection", (ws, req) => {
  const userId = req.url.split("/").pop();
  clients.set(userId, ws);

  ws.on("close", () => {
    clients.delete(userId);
  });
});

// Function to notify clients about profile picture update
const notifyProfilePictureUpdate = (userId, filePath) => {
  const client = clients.get(userId);
  if (client) {
    client.send(JSON.stringify({ profile_picture: filePath }));
  }
};

// Class Routes
router.get("/class", ClassController.findClass);
router.get("/entered-class/:class_id", ClassController.enteredClass);
router.get("/detail-class/:id", ClassController.detailClass);
router.post("/add-class", ClassController.addClass);
router.delete("/delete-class/:id", ClassController.deleteClass);
router.put("/edit-class/:id", ClassController.updateClass);

// User Routes
router.get("/users", UserController.findUsers);
router.post("/register", validateUser, UserController.createUser);
router.post("/login", UserController.login);
router.get("/count-collections", UserController.countCollections);
router.post("/create-user", UserController.createUser);
router.put("/edit-user/:id", UserController.updateUser);
router.delete("/delete-user/:id", UserController.deleteUser);
router.get("/profile/:userId", UserController.profileUser);
router.post("/getUsersByIds", UserController.getUsersByIds);
router.get("/users/:id", UserController.getUserById);

// Materials Router
router.get("/materials", MaterialController.findMaterials);
router.post(
  "/create-material",
  upload.single("data_pdf"),
  MaterialController.createMaterial
);
// router.post("/create-material", MaterialController.createMaterial);
router.delete("/delete-material/:id", MaterialController.deleteMaterial);
router.get("/download-pdf/:id", MaterialController.downloadPdf);
router.post("/getMaterialsByIds", MaterialController.getMaterialsByIds);

// Quizzes Router
router.get("/quiz", QuizController.findQuizzes);
router.get("/quiz/:quiz_id", QuizController.detailsQuizQuestion);

// Upload Profile Picture
router.post("/upload", upload.single("profilePicture"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const userId = req.body.userId;
  const filePath = req.file.path;

  try {
    await UserController.uploadProfilePicture(userId, filePath);
    notifyProfilePictureUpdate(userId, filePath); // Notify client about the update
    res.json({ message: "Profile picture uploaded successfully!" });
  } catch (error) {
    console.error("Error updating user profile picture:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Export router
module.exports = router;
