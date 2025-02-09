const express = require("express");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");

// import PrismaClient
const { PrismaClient } = require("@prisma/client");
//  init prisma client
const prisma = new PrismaClient();
// import validationResult from express-validator
const { validationResult } = require("express-validator");

// import bcrypt
const bcrypt = require("bcryptjs"); // Untuk memverifikasi password
const saltRounds = 10; // Jumlah putaran untuk hashing (semakin tinggi, semakin aman namun lebih lambat)

// import jsonwebtoken
const jwt = require("jsonwebtoken");

const multer = require("multer");
const path = require("path");

// Web Socket
const WebSocket = require("ws");
const http = require("http");
const { error } = require("console");
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
// const wss = new WebSocket.Server({ port: 8080 });

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

// FUNCTION USER CONTROLLER WITHOUT PRISMA START
// FUNCTION USER CONTROLLER WITHOUT PRISMA START
// FUNCTION USER CONTROLLER WITHOUT PRISMA START
// FUNCTION USER CONTROLLER WITHOUT PRISMA START

// URI koneksi ke database
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

// function findUsers
const findUsers = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("benkyou");
    const usersCollection = db.collection("users");

    // Ambil semua data user dari database
    const users = await usersCollection
      .find()
      .sort({ create_at: -1 }) // Urutkan berdasarkan tanggal pembuatan (descending)
      .toArray();

    // Kirim response
    res.status(200).send({
      success: true,
      message: "Get All Users Successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const getUserById = async (req, res) => {
  const userId = req.params.id; // Ambil ID dari parameter URL

  try {
    const db = client.db("benkyou");
    const usersCollection = db.collection("users");

    // Konversi userId ke ObjectId MongoDB
    const user = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { username: 1 } } // Hanya mengambil username
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Kirim username sebagai respons
    res.status(200).json({ username: user.username });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUsersByIds = async (req, res) => {
  const { ids } = req.body;

  try {
    const db = client.db("benkyou");
    const usersCollection = db.collection("users");

    const objectIds = ids.map((id) => new ObjectId(id));
    const users = await usersCollection
      .find({ _id: { $in: objectIds } })
      .toArray();

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
    console.log(error);
  }
};

const createUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation error",
      errors: errors.array(),
    });
  }

  try {
    const db = client.db("benkyou");
    const usersCollection = db.collection("users");

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = {
      username: req.body.username,
      password: hashedPassword,
      name: req.body.name,
      full_name: req.body.full_name,
      no_hp: parseInt(req.body.no_hp, 10),
      email: req.body.email,
      role: req.body.role,
      create_at: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);
    newUser._id = result.insertedId; // Tambahkan _id ke response

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const profileUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const db = client.db("benkyou");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const uploadProfilePicture = async (userId, filePath) => {
  try {
    const db = client.db("benkyou");
    const usersCollection = db.collection("users");

    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { profile_picture: filePath } }
    );

    const ws = clients.get(userId);
    if (ws) {
      ws.send(JSON.stringify({ profile_picture: filePath }));
    }
  } catch (error) {
    console.error("Error updating profile picture:", error);
    throw error;
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const db = client.db("benkyou");
    const usersCollection = db.collection("users");

    const userForCheck = await usersCollection.findOne({ username });

    if (!userForCheck) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      userForCheck.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: userForCheck._id, username: userForCheck.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        _id: userForCheck._id,
        username: userForCheck.username,
        name: userForCheck.name,
        full_name: userForCheck.full_name,
        no_hp: userForCheck.no_hp,
        email: userForCheck.email,
        role: userForCheck.role,
        create_at: userForCheck.create_at,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const countCollections = async (req, res) => {
  try {
    // const db = getDb();
    const db = client.db("benkyou");
    const [userCount, classCount, materialCount, quizCount] = await Promise.all(
      [
        db.collection("users").countDocuments(),
        db.collection("class").countDocuments(),
        db.collection("materials").countDocuments(),
        db.collection("quiz").countDocuments(),
      ]
    );

    res.status(200).send({
      success: true,
      data: {
        users: userCount,
        classes: classCount,
        materials: materialCount,
        quizzes: quizCount,
      },
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const db = client.db("benkyou");
    const usersCollection = db.collection("users");

    const updatedUser = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          username: req.body.username,
          name: req.body.name,
          full_name: req.body.full_name,
          no_hp: parseInt(req.body.no_hp, 10),
          email: req.body.email,
          role: req.body.role,
        },
      },
      { returnDocument: "after" }
    );

    console.log("Updated User:", updatedUser);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    // Pastikan koneksi ke database
    await client.connect();
    const db = client.db("benkyou");
    const usersCollection = db.collection("users");

    // Konversi ID dari string ke ObjectId
    const userId = new ObjectId(req.params.id);

    const result = await usersCollection.deleteOne({ _id: userId });

    // const result = await usersCollection.deleteOne({
    //   _id: new ObjectId(req.params.id),
    // });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// FUNCTION USER CONTROLLER WITHOUT PRISMA END
// FUNCTION USER CONTROLLER WITHOUT PRISMA END
// FUNCTION USER CONTROLLER WITHOUT PRISMA END
// FUNCTION USER CONTROLLER WITHOUT PRISMA END

// function findUsers
// const findUsers = async (req, res) => {
//   try {
//     // get all users from database
//     const users = await prisma.user.findMany({
//       select: {
//         id: true,
//         username: true,
//         password: true,
//         name: true,
//         full_name: true,
//         no_hp: true,
//         email: true,
//         role: true,
//         create_at: true,
//         profile_picture: true,
//       },
//       orderBy: {
//         create_at: "desc",
//       },
//     });

//     // send response
//     res.status(200).send({
//       success: true,
//       message: "Get All Posts Successfully",
//       data: users,
//     });
//   } catch (error) {
//     console.log("Error", error);
//     res.status(500).send({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// Controller untuk mendapatkan username berdasarkan ID
// const getUserById = async (req, res) => {
//   const userId = req.params.id; // Ambil ID dari parameter URL

//   try {
//     // Query ke database untuk mendapatkan username
//     const user = await prisma.user.findUnique({
//       where: { id: userId }, // Pastikan `id` ada di model User
//       select: { username: true }, // Hanya ambil kolom username
//     });

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // Kirim username sebagai respons
//     res.status(200).json({ username: user.username });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// DARI SINI
// DARI SINI
// DARI SINI
// DARI SINI
// DARI SINI
// DARI SINI
// function untuk mengambil data user berdasarkan banyak id
// const getUsersByIds = async (req, res) => {
//   const { ids } = req.body;
//   try {
//     const users = await prisma.user.findMany({
//       where: {
//         id: { in: ids },
//       },
//     });

//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fecth user" });
//     console.log(error);
//   }
// };

// // function createUser
// const createUser = async (req, res) => {
//   // // periksa hasil validasi
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     // jika ada error kembalikan error ke pengguna
//     return res.status(422).json({
//       success: false,
//       message: "Validation error",
//       errors: errors.array(),
//     });
//   }

//   // jika request sudah sesuai dengan validasi,
//   // maka kita akan melakukan proses insert data ke dalam mongodb menggunakan prisma
//   try {
//     // Mengenkripsi password sebelum disimpan ke dalam database
//     const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

//     // insert data ke dalam mongodb
//     const newUser = await prisma.user.create({
//       data: {
//         username: req.body.username,
//         password: hashedPassword,
//         name: req.body.name,
//         full_name: req.body.full_name,
//         no_hp: parseInt(req.body.no_hp, 10),
//         email: req.body.email,
//         role: req.body.role,
//         create_at: new Date(),
//       },
//     });

//     res.status(201).json({
//       success: true,
//       message: "User created successfully",
//       data: newUser,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// // profile user
// const profileUser = async (req, res) => {
//   const { userId } = req.params; // Mengambil userId dari parameter URL
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(user);
//     // res.status(200).json({
//     //   success: true,
//     //   data: user,
//     // });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// const uploadProfilePicture = async (userId, filePath) => {
//   try {
//     await prisma.user.update({
//       where: { id: userId },
//       data: { profile_picture: filePath },
//     });

//     const ws = clients.get(userId);
//     if (ws) {
//       ws.send(JSON.stringify({ profile_picture: filePath }));
//     }
//   } catch (error) {
//     console.error("Error updating profile picture:", error);
//     throw error;
//   }
// };

// // Login Function
// const login = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Cari user berdasarkan username
//     const userForCheck = await prisma.user.findFirst({
//       where: {
//         username: username,
//       },
//       select: {
//         id: true,
//         username: true,
//         password: true,
//         name: true,
//         full_name: true,
//         no_hp: true,
//         email: true,
//         role: true,
//       },
//     });

//     // Jika user tidak ditemukan
//     if (!userForCheck) {
//       return res.status(400).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     // Verifikasi password menggunakan bcrypt
//     const isPasswordValid = await bcrypt.compare(
//       password,
//       userForCheck.password
//     );
//     if (!isPasswordValid) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid password",
//       });
//     }

//     // Jika username dan password valid, buat token
//     const token = jwt.sign(
//       { id: userForCheck.id, username: userForCheck.username }, // Data yang dimasukkan ke token
//       process.env.JWT_SECRET, // Gunakan key rahasia
//       { expiresIn: "1h" } // Token berlaku selama 1 jam
//     );

//     // Jika login berhasil, kirimkan response sukses
//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       data: {
//         _id: userForCheck.id,
//         username: userForCheck.username,
//         name: userForCheck.name,
//         full_name: userForCheck.full_name,
//         no_hp: userForCheck.no_hp,
//         email: userForCheck.email,
//         role: userForCheck.role,
//         create_at: userForCheck.create_at,
//       },
//     });
//   } catch (error) {
//     console.error("Login error:", error); // Log the full error here
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };

// const countCollections = async (req, res) => {
//   try {
//     // Hitung jumlah data di collection users dan class
//     const [userCount, classCount, materialCount, quizCount] = await Promise.all(
//       [
//         prisma.user.count(),
//         prisma.class.count(),
//         prisma.material.count(),
//         prisma.quiz.count(),
//       ]
//     );

//     // Kirim response
//     res.status(200).send({
//       success: true,
//       data: {
//         users: userCount,
//         classes: classCount,
//         materials: materialCount,
//         quizzes: quizCount,
//       },
//     });
//   } catch (error) {
//     console.error("Error", error);
//     res.status(500).send({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// const updateUser = async (req, res) => {
//   try {
//     const updatedUser = await prisma.user.update({
//       where: {
//         id: req.params.id,
//       },
//       data: {
//         username: req.body.username,
//         name: req.body.name,
//         full_name: req.body.full_name,
//         no_hp: parseInt(req.body.no_hp, 10),
//         email: req.body.email,
//         role: req.body.role,
//       },
//     });

//     res.status(200).json({
//       success: true,
//       message: "User updated successfully",
//       data: updatedUser,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// const deleteUser = async (req, res) => {
//   try {
//     await prisma.user.delete({
//       where: {
//         id: req.params.id,
//       },
//     });

//     res.status(200).json({
//       success: true,
//       message: "User deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

module.exports = {
  findUsers,
  createUser,
  profileUser,
  login,
  countCollections,
  updateUser,
  deleteUser,
  uploadProfilePicture,
  getUsersByIds,
  getUserById,
};
