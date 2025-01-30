const express = require("express");
const app = express();

// import PrismaClient
const { PrismaClient } = require("@prisma/client");
//  init prisma client
const prisma = new PrismaClient();

// FUNCTION TO FIND ALL QUIZ WITHOUT PRISMA START
// FUNCTION TO FIND ALL QUIZ WITHOUT PRISMA START
// FUNCTION TO FIND ALL QUIZ WITHOUT PRISMA START
// FUNCTION TO FIND ALL QUIZ WITHOUT PRISMA START

// function findQuizzess

const { MongoClient, ObjectId } = require("mongodb");

// CONNECTION TO MONGODB
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

const findQuizzes = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("benkyou");
    const quizzesCollection = db.collection("quiz");

    // Ambil semua quiz dari database dan urutkan berdasarkan created_at secara descending
    const quizzes = await quizzesCollection
      .find()
      .sort({ created_at: -1 })
      .toArray();

    console.log("Data quiz saat ini:", quizzes);

    // Kirim response
    res.status(200).send({
      success: true,
      message: "Get All Quizzes Successfully",
      data: quizzes,
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  } finally {
    await client.close();
  }
};

// Detail quiz questions
const detailsQuizQuestion = async (req, res) => {
  const quiz_id = req.params.quiz_id;

  try {
    await client.connect();
    const db = client.db("benkyou");

    const quiz = await db
      .collection("quiz")
      .findOne({ _id: new ObjectId(quiz_id) });

    console.log("Data quiz saat ini dari controller :", quiz);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.json({
      success: true,
      message: "Get details quiz successfully",
      quiz,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).send("Error fetching quiz");
  }
};

// Create Quiz
const createQuiz = async (req, res) => {
  try {
    const { teacher_id, title, questions } = req.body;

    if (
      !teacher_id ||
      !title ||
      !Array.isArray(questions) ||
      questions.length === 0
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await client.connect();
    const db = client.db("benkyou");
    const quizCollection = db.collection("quiz");

    const newQuiz = {
      teacher_id,
      title,
      questions,
      created_at: new Date(),
    };

    const result = await quizCollection.insertOne(newQuiz);
    res.status(201).json({
      success: true,
      message: "Quiz added successfully",
      quiz: result,
    });
  } catch (error) {
    console.error("Error adding quiz:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// const createQuiz = async (req, res) => {
//   try {
//     const { title, questions, created_at } = req.body;
//     const quiz = {
//       title,
//       questions,
//       created_at: new Date(created_at),
//     };

//     const result = await db.collection("quiz").insertOne(quiz);
//     console.log("ini result menambahkan quiz dari backend : ", result);
//     res.status(201).json({
//       success: true,
//       message: "Quiz added",
//       quizId: result.insertedId,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error saving quiz",
//       error: error.message,
//     });
//   }
// };

// FUNCTION TO FIND ALL QUIZ WITHOUT PRISMA END
// FUNCTION TO FIND ALL QUIZ WITHOUT PRISMA END
// FUNCTION TO FIND ALL QUIZ WITHOUT PRISMA END
// FUNCTION TO FIND ALL QUIZ WITHOUT PRISMA END

// function findQuizzes
// const findQuizzes = async (req, res) => {
//   try {
//     // get all users from database
//     const quiz = await prisma.quiz.findMany({
//       orderBy: {
//         created_at: "desc",
//       },
//     });

//     console.log("data quiz saat ini : ", quiz);

//     // send response
//     res.status(200).send({
//       success: true,
//       message: "Get All Posts Successfully",
//       data: quiz,
//     });
//   } catch (error) {
//     console.log("Error", error);
//     res.status(500).send({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// const detailsQuizQuestion = async (req, res) => {
//   const quiz_id = req.params.quiz_id;

//   try {
//     const quiz = await prisma.quiz.findUnique({
//       where: { id: quiz_id },
//       select: {
//         class_id: false,
//         title: true,
//         questions: true,
//         created_at: false,
//       },
//     });

//     res.json({
//       success: true,
//       message: "Get details quiz successfully",
//       quiz,
//     });
//   } catch (error) {
//     console.error("Error fetching quiz:", error);
//     res.status(500).send("Error fetching quiz");
//   }
// };

// const createMaterial = async (req, res) => {
//   try {
//     // Ambil data dari body request
//     const { teacher_id, title, content, content_type } = req.body;

//     // Validasi data yang diperlukan
//     if (!teacher_id || !title || !content || !content_type) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Semua field wajib diisi" });
//     }

//     // Simpan data ke database menggunakan Prisma
//     const newMaterial = await prisma.material.create({
//       data: {
//         teacher_id: teacher_id,
//         title,
//         content_type,
//         content,
//       },
//     });

//     // Kirim respon sukses
//     res.status(201).json({
//       success: true,
//       message: "Material berhasil dibuat",
//       data: newMaterial,
//     });
//   } catch (error) {
//     console.error("Error saat membuat material:", error);
//     res.status(500).json({
//       success: false,
//       message: "Terjadi kesalahan saat membuat material",
//     });
//   }
// };

// const deleteQuiz = async (req, res) => {
//   try {
//     await prisma.material.delete({
//       where: {
//         id: req.params.id,
//       },
//     });

//     res.status(200).json({
//       success: true,
//       message: "Material deleted successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

module.exports = {
  findQuizzes,
  detailsQuizQuestion,
  createQuiz,
};
