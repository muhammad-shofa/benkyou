// import PrismaClient
const { PrismaClient } = require("@prisma/client");
//  init prisma client
const prisma = new PrismaClient();
// import validationResult from express-validator
const { validationResult } = require("express-validator");

const { MongoClient, ObjectId } = require("mongodb");

// import bcrypt
const bcrypt = require("bcryptjs"); // Untuk memverifikasi password
const saltRounds = 10; // Jumlah putaran untuk hashing (semakin tinggi, semakin aman namun lebih lambat)

// import jsonwebtoken
const jwt = require("jsonwebtoken");

// // function findClass
// const findClass = async (req, res) => {
//   try {
//     // get all class from database
//     const classes = await prisma.class.findMany({
//       select: {
//         id: true,
//         name: true,
//         description: true,
//         teacher_id: true,
//         students: true,
//         materials: true,
//         quizzes: true,
//         create_at: true,
//       },
//       orderBy: {
//         create_at: "desc",
//       },
//     });

//     //  formatted class
//     // Modifikasi hasil untuk hanya menampilkan jumlah teacher_id dan students
//     const formattedClasses = classes.map((classItem) => ({
//       id: classItem.id,
//       name: classItem.name,
//       description: classItem.description,
//       teacher_id: classItem.teacher_id,
//       students_id: classItem.students,
//       student_count: Array.isArray(classItem.students)
//         ? classItem.students.length
//         : 0,
//       materials_id: classItem.materials,
//       material_count: Array.isArray(classItem.materials)
//         ? classItem.materials.length
//         : 0,
//       quizzes_id: classItem.quizzes,
//       quizzes_count: Array.isArray(classItem.quizzes)
//         ? classItem.quizzes.length
//         : 0,
//       create_at: classItem.create_at,
//     }));

//     // send response
//     res.status(200).send({
//       success: true,
//       message: "Get All Posts Successfully",
//       data: formattedClasses,
//     });
//   } catch (error) {
//     console.log("Error", error);
//     res.status(500).send({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// FUNCTION TO FIND ALL CLASS WITHOUT PRISMA START
// FUNCTION TO FIND ALL CLASS WITHOUT PRISMA START
// FUNCTION TO FIND ALL CLASS WITHOUT PRISMA START
// FUNCTION TO FIND ALL CLASS WITHOUT PRISMA START
// URI koneksi ke database
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

// findClass
const findClass = async (req, res) => {
  try {
    // Koneksi ke database
    const client = await MongoClient.connect("mongodb://localhost:27017");
    const db = client.db("benkyou");
    const classCollection = db.collection("class");

    // Ambil parameter dari request
    const userRole = req.query.role;
    const userId = req.query.id;

    console.log("userRole", userRole);
    console.log("userId", userId);

    let query = {};

    if (userRole === "student") {
      query = { students: userId };
    } else if (userRole === "teacher") {
      query = { teacher_id: userId };
    } // Jika admin, query tetap kosong ({}), berarti ambil semua data

    // Ambil data class sesuai query
    const classes = await classCollection
      .find(query)
      .sort({ create_at: -1 })
      .toArray();

    console.log("ini class", classes);

    // Format hasil untuk menampilkan jumlah students, materials, dan quizzes
    const formattedClasses = classes.map((classItem) => ({
      id: classItem._id,
      name: classItem.name,
      description: classItem.description,
      teacher_id: classItem.teacher_id,
      students_id: classItem.students,
      student_count: Array.isArray(classItem.students)
        ? classItem.students.length
        : 0,
      materials_id: classItem.materials,
      material_count: Array.isArray(classItem.materials)
        ? classItem.materials.length
        : 0,
      quizzes_id: classItem.quizzes,
      quizzes_count: Array.isArray(classItem.quizzes)
        ? classItem.quizzes.length
        : 0,
      create_at: classItem.create_at,
    }));

    console.log("ini formatted classes", formattedClasses);

    // Kirimkan response
    res.status(200).send({
      success: true,
      message: "Get Classes Successfully",
      data: formattedClasses,
    });

    // Tutup koneksi ke database
    // client.close();
  } catch (error) {
    console.log("Error", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  }
};

// NEW function findClass

// const findClass = async (req, res) => {
//   try {
//     const db = client.db("benkyou");
//     const classCollection = db.collection("class");

//     const userRole = req.query.role;
//     const userId = req.query.id;

//     let query = {};

//     if (userRole === "student") {
//       query = { students: new ObjectId(userId) };
//     } else if (userRole === "teacher") {
//       query = { teacher_id: userId };
//     }

//     const classes = await classCollection.find(query).toArray();

//     res.status(200).json({ success: true, data: classes });
//   } catch (error) {
//     console.error("Error fetching classes:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// Function findClass old
// const findClass = async (req, res) => {
//   try {
//     // Koneksi ke database
//     const client = await MongoClient.connect("mongodb://localhost:27017");
//     const db = client.db("benkyou"); // Ganti dengan nama database kamu
//     const classCollection = db.collection("class"); // Ganti dengan nama collection kamu

//     // Mendapatkan semua data class dari database
//     const classes = await classCollection
//       .find({})
//       .sort({ create_at: -1 })
//       .toArray();

//     // Format hasil untuk menampilkan jumlah students, materials, dan quizzes
//     const formattedClasses = classes.map((classItem) => ({
//       id: classItem._id,
//       name: classItem.name,
//       description: classItem.description,
//       teacher_id: classItem.teacher_id,
//       students_id: classItem.students,
//       student_count: Array.isArray(classItem.students)
//         ? classItem.students.length
//         : 0,
//       materials_id: classItem.materials,
//       material_count: Array.isArray(classItem.materials)
//         ? classItem.materials.length
//         : 0,
//       quizzes_id: classItem.quizzes,
//       quizzes_count: Array.isArray(classItem.quizzes)
//         ? classItem.quizzes.length
//         : 0,
//       create_at: classItem.create_at,
//     }));

//     // Kirimkan response
//     res.status(200).send({
//       success: true,
//       message: "Get All Posts Successfully",
//       data: formattedClasses,
//     });

//     // Tutup koneksi ke database
//     client.close();
//   } catch (error) {
//     console.log("Error", error);
//     res.status(500).send({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// Fungsi untuk mendapatkan detail kelas
const detailClass = async (req, res) => {
  try {
    const { id } = req.params;

    // Pastikan koneksi ke database
    await client.connect();
    const database = client.db("benkyou"); // Ganti dengan nama database
    const classesCollection = database.collection("class"); // Ganti dengan nama koleksi

    // Cari data kelas berdasarkan id
    const classDetail = await classesCollection.findOne(
      { _id: new ObjectId(id) }, // Mengonversi id ke tipe ObjectId
      {
        projection: {
          id: 1,
          students: 1,
        },
      }
    );

    if (!classDetail) {
      return res.status(404).send({
        success: false,
        message: "Class not found",
      });
    }

    // Kirim respons
    res.status(200).send({
      success: true,
      message: "Get Class Detail Successfully",
      data: classDetail,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  } finally {
    // Tutup koneksi ke database
    await client.close();
  }
};

// Fungsi untuk menambahkan kelas
const addClass = async (req, res) => {
  try {
    const { name, description, teacher_id, students, materials, quizzes } =
      req.body;

    // Validasi input data
    if (!name || !description || !teacher_id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Pastikan koneksi ke database
    await client.connect();
    const database = client.db("benkyou"); // Ganti dengan nama database
    const classesCollection = database.collection("class"); // Ganti dengan nama koleksi

    // Buat data kelas baru
    const newClass = {
      name,
      description,
      teacher_id,
      students: students || [], // Pastikan array (default: [])
      materials: materials || [], // Pastikan array (default: [])
      quizzes: quizzes || [], // Pastikan array (default: [])
      create_at: new Date(),
    };

    // Simpan data ke database
    const result = await classesCollection.insertOne(newClass);

    // Kirim respons
    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: {
        id: result.insertedId, // ID yang baru dibuat
        ...newClass,
      },
    });
  } catch (error) {
    console.error("Error creating class:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", error });
  } finally {
    // Tutup koneksi ke database
    await client.close();
  }
};

// Fungsi untuk mengambil data kelas berdasarkan `class_id`
const enteredClass = async (req, res) => {
  const { class_id } = req.params;

  try {
    // Pastikan koneksi ke database
    await client.connect();
    const database = client.db("benkyou");
    const classesCollection = database.collection("class");
    const usersCollection = database.collection("users"); // Koleksi untuk teacher
    const materialsCollection = database.collection("materials");
    const quizzesCollection = database.collection("quiz");

    // Ambil data kelas
    const classData = await classesCollection.findOne({
      _id: new ObjectId(class_id),
    });

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Ambil data teacher berdasarkan teacher_id
    const teacherData = await usersCollection.findOne(
      { _id: new ObjectId(classData.teacher_id) },
      { projection: { name: 1, profile_picture: 1 } }
    );

    // Ambil data materials terkait berdasarkan ID dalam array `materials`
    const materialIds = classData.materials || [];
    const materialsData = await materialsCollection
      .find({ _id: { $in: materialIds.map((id) => new ObjectId(id)) } })
      .project({
        id: 1,
        teacher_id: 1,
        title: 1,
        content_type: 1,
        content_text: 1,
        name_pdf: 1,
        data_pdf: 1,
        mimetype_pdf: 1,
      })
      .toArray();

    const quizIds = classData.quizzes || [];
    const quizzesData = await quizzesCollection
      .find({ _id: { $in: quizIds.map((id) => new ObjectId(id)) } })
      .project({
        id: 1,
        class_id: 1,
        title: 1,
        questuions: 1,
      })
      .toArray();

    // Gabungkan semua data menjadi satu respons
    const responseData = {
      ...classData,
      teacher: teacherData || null,
      materials: materialsData || [],
      quizzes: quizzesData || [],
    };

    // console.log(responseData);

    // Kirim respons ke client
    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error("Error fetching class data:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    // Tutup koneksi ke database
    await client.close();
  }
};

// Fungsi untuk menghapus data kelas berdasarkan `id`
const deleteClass = async (req, res) => {
  try {
    // Pastikan koneksi ke database
    await client.connect();
    const database = client.db("benkyou");
    const classesCollection = database.collection("class");

    // Hapus data kelas berdasarkan ID
    const result = await classesCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    // Jika tidak ada dokumen yang dihapus
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Kirim respons sukses
    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  } finally {
    // Tutup koneksi ke database
    await client.close();
  }
};

// Get data for Edit Class Endpoint
const getClassForEdit = async (req, res) => {
  const { classId } = req.params;

  try {
    // Validasi ObjectId untuk MongoDB
    if (!ObjectId.isValid(classId)) {
      return res.status(400).json({ message: "Invalid class ID format" });
    }

    // Koneksi ke database MongoDB
    const client = await MongoClient.connect("mongodb://localhost:27017");
    const db = client.db("benkyou"); // Gantilah nama database jika berbeda

    // Cari data kelas berdasarkan classId
    const classData = await db
      .collection("class")
      .findOne({ _id: new ObjectId(classId) });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Ambil data siswa berdasarkan student IDs
    const studentUsernames = await db
      .collection("users")
      .find({
        _id: {
          $in: classData.students.map((studentId) => new ObjectId(studentId)),
        }, // Pastikan students berisi array ObjectId
      })
      .project({ username: 1 })
      .toArray();

    // Ambil data materi berdasarkan material IDs
    const materialTitles = await db
      .collection("materials")
      .find({
        _id: {
          $in: classData.materials.map(
            (materialId) => new ObjectId(materialId)
          ),
        }, // Pastikan materials berisi array ObjectId
      })
      .project({ title: 1 })
      .toArray();

    // Ambil data kuis berdasarkan quiz IDs
    const quizTitles = await db
      .collection("quiz")
      .find({
        _id: { $in: classData.quizzes.map((quizId) => new ObjectId(quizId)) }, // Pastikan quizzes berisi array ObjectId
      })
      .project({ title: 1 })
      .toArray();

    // Gabungkan data dan kirimkan hasilnya ke frontend
    res.status(200).json({
      success: true,
      data: {
        classId: classData._id,
        name: classData.name,
        description: classData.description,
        teacher_id: classData.teacher_id,
        students: studentUsernames.map((student) => ({
          id: student._id, // Kirimkan ID bersama dengan username
          username: student.username,
        })),
        materials: materialTitles.map((material) => ({
          id: material._id, // Kirimkan ID bersama dengan title
          title: material.title,
        })),
        quizzes: quizTitles.map((quiz) => ({
          id: quiz._id, // Kirimkan ID bersama dengan title
          title: quiz.title,
        })),
      },
    });

    // Tutup koneksi
    client.close();
  } catch (error) {
    console.error("Error getting class for edit:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// const getClassForEdit = async (req, res) => {
//   const { classId } = req.params;
//   console.log("classId:", classId);

//   try {
//     // Validasi format ObjectId
//     if (!ObjectId.isValid(classId)) {
//       return res.status(400).json({ message: "Invalid class ID format" });
//     }

//     // Pastikan koneksi ke database
//     await client.connect();
//     const database = client.db("benkyou");
//     const classesCollection = database.collection("class");

//     // Cari class berdasarkan ID
//     const classData = await classesCollection.findOne({
//       _id: new ObjectId(classId),
//     });

//     if (!classData) {
//       return res.status(404).json({
//         success: false,
//         message: "Class not found",
//       });
//     }

//     // Ambil data usernames untuk students
//     const usersCollection = database.collection("users");
//     const studentUsernames = await usersCollection
//       .find({
//         _id: {
//           $in: classData.students.map((studentId) => new ObjectId(studentId)),
//         },
//       })
//       .project({ _id: 1, username: 1 })
//       .toArray();

//     // Ambil data titles untuk materials
//     const materialsCollection = database.collection("materials");
//     const materialTitles = await materialsCollection
//       .find({
//         _id: {
//           $in: classData.materials.map(
//             (materialId) => new ObjectId(materialId)
//           ),
//         },
//       })
//       .project({ _id: 1, title: 1 })
//       .toArray();

//     // Ambil data titles untuk quizzes
//     const quizzesCollection = database.collection("quiz");
//     const quizTitles = await quizzesCollection
//       .find({
//         _id: { $in: classData.quizzes.map((quizId) => new ObjectId(quizId)) },
//       })
//       .project({ _id: 1, title: 1 })
//       .toArray();

//     // Kirimkan data yang sudah diproses ke frontend
//     res.status(200).json({
//       success: true,
//       data: {
//         ...classData,
//         students: studentUsernames,
//         materials: materialTitles,
//         quizzes: quizTitles,
//       },
//     });
//   } catch (error) {
//     console.error("Error getting class for edit:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   } finally {
//     // Tutup koneksi ke database
//     await client.close();
//   }
// };

// Controller untuk memperbarui data kelas
const updateClass = async (req, res) => {
  try {
    const { id } = req.params; // Ambil ID kelas dari URL parameter
    const updatedClass = req.body; // Data kelas yang dikirimkan dari frontend

    // Validasi jika ID kelas tidak valid
    // if (!ObjectId.isValid(id)) {
    //   return res.status(400).send({
    //     success: false,
    //     message: "Invalid class ID",
    //   });
    // }

    // Pastikan properti `students`, `materials`, dan `quizzes` berisi array ID yang valid
    // if (
    //   !Array.isArray(updatedClass.students) ||
    //   !Array.isArray(updatedClass.materials) ||
    //   !Array.isArray(updatedClass.quizzes)
    // ) {
    //   return res.status(400).send({
    //     success: false,
    //     message:
    //       "Invalid data format. Arrays expected for students, materials, and quizzes.",
    //   });
    // }

    // Konversi semua ID ke ObjectId
    updatedClass.students = updatedClass.students.map(
      (studentId) => new ObjectId(studentId)
    );
    updatedClass.materials = updatedClass.materials.map(
      (materialId) => new ObjectId(materialId)
    );
    updatedClass.quizzes = updatedClass.quizzes.map(
      (quizId) => new ObjectId(quizId)
    );

    // Koneksi ke database
    await client.connect();
    const db = client.db("benkyou"); // Ganti sesuai nama database Anda
    const classesCollection = db.collection("class");

    // Update data kelas berdasarkan ID
    const result = await classesCollection.updateOne(
      { _id: new ObjectId(id) }, // Cari kelas berdasarkan ID
      { $set: updatedClass } // Perbarui data kelas dengan data baru
    );

    // Periksa apakah update berhasil
    if (result.matchedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Class updated successfully",
      data: updatedClass, // Kirim data kelas yang diperbarui sebagai respons
    });
  } catch (error) {
    console.error("Error updating class:", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  } finally {
    await client.close(); // Pastikan koneksi ditutup
  }
};

// FUNCTION TO FIND ALL CLASS WITHOUT PRISMA END
// FUNCTION TO FIND ALL CLASS WITHOUT PRISMA END
// FUNCTION TO FIND ALL CLASS WITHOUT PRISMA END
// FUNCTION TO FIND ALL CLASS WITHOUT PRISMA END

// const detailClass = async (req, res) => {
//   try {
//     const { id } = req.params;
//     // get class by id
//     const classDetail = await prisma.class.findUnique({
//       where: {
//         id: id,
//       },
//       select: {
//         id: true,
//         name: false,
//         description: false,
//         teacher_id: false,
//         students: true,
//         materials: false,
//         create_at: false,
//       },
//     });

//     // send response
//     res.status(200).send({
//       success: true,
//       message: "Get Class Detail Successfully",
//       data: classDetail,
//     });
//   } catch (error) {
//     console.log("Error", error);
//     res.status(500).send({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// Function to handle adding a class
// const addClass = async (req, res) => {
//   const { name, description, teacher_id, students, materials } = req.body;

//   try {
//     // Create a new class in the database
//     const newClass = await prisma.class.create({
//       data: {
//         name,
//         description,
//         // teacher,
//         teacher: { connect: { id: teacher_id } },
//         students: {
//           connect: students.map((studentId) => ({ id: studentId })),
//         },
//         materials: {
//           connect: materials.map((materialId) => ({ id: materialId })),
//         },
//         quiz,
//       },
//     });

//     res.status(201).json({ success: true, data: newClass });
//   } catch (error) {
//     console.error("Error creating class:", error);
//     res
//       .status(500)
//       .json({
//         success: false,
//         message: "Failed to create class",
//         error: error.message,
//       });
//   }
// };

// const addClass = async (req, res) => {
//   const { name, description, teacher_id, selectedStudents, selectedMaterials } =
//     req.body;

//   try {
//   // Pastikan selectedStudents dan selectedMaterials terdefinisi dan berupa array
//   const studentIds = Array.isArray(selectedStudents) ? selectedStudents.map(student => student.id) : [];
//   const materialIds = Array.isArray(selectedMaterials) ? selectedMaterials.map(material => material.id) : [];

//   // Membuat kelas baru dengan data yang diterima
//   const newClass = await prisma.class.create({
//     data: {
//       name,
//       description,
//       teacher_id,
//       students: studentIds,
//       materials: materialIds,
//     },
//   });

//     res.status(200).json({
//       success: true,
//       data: newClass,
//       message: "Class successfully added",
//     });
//   } catch (error) {
//     console.error("Error creating class:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create class",
//       error: error.message,
//     });
//   }
// };

// const addClass = async (req, res) => {
//   try {
//     const { name, description, teacher_id, students, materials, quizzes } =
//       req.body;

//     // Validate input data
//     if (!name || !description || !teacher_id) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing required fields" });
//     }

//     // Create new class entry in the database
//     const newClass = await prisma.class.create({
//       data: {
//         name,
//         description,
//         teacher_id,
//         students, // Langsung simpan array ID
//         materials, // Langsung simpan array ID
//         quizzes, // Langsung simpan array ID
//         create_at: new Date(),
//       },
//     });

//     res.status(201).json({
//       success: true,
//       message: "Class created successfully",
//       data: newClass,
//     });
//   } catch (error) {
//     console.error("Error creating class:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Internal Server Error", error });
//   }
// };

// function untuk menghapus class
// const deleteClass = async (req, res) => {
//   try {
//     await prisma.class.delete({
//       where: {
//         id: req.params.id,
//       },
//     });

//     res.status(200).json({
//       success: true,
//       message: "Class deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// const enteredClass = async (req, res) => {
//   const { class_id } = req.params;

//   try {
//     // Asumsikan Anda memiliki model Class yang terhubung dengan database
//     const classData = await prisma.class.findUnique({
//       where: {
//         id: class_id,
//       },
//     });

//     if (!classData) {
//       return res.status(404).json({ message: "Class not found" });
//     }

//     // Kirim data kelas sebagai respons
//     res.status(200).json(classData);
//   } catch (error) {
//     console.error("Error fetching class data:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const enteredClass = async (req, res) => {
//   const { class_id } = req.params;

//   try {
//     // Mengambil data kelas beserta informasi teacher dan materials terkait
//     const classData = await prisma.class.findUnique({
//       where: {
//         id: class_id,
//       },
//       include: {
//         students: true,
//         materials: true,
//         teacher: true,
//       },
//       include: {
//         teacher: {
//           // Mengambil data terkait dari model User berdasarkan teacher_id
//           select: {
//             name: true,
//             profile_picture: true,
//           },
//         },
//         materials: {
//           // Mengambil data terkait dari model Material
//           select: {
//             id: true,
//             teacher_id: true,
//             title: true,
//             content_type: true,
//             name_pdf: true,
//             data_pdf: true,
//             mimetype_pdf: true,
//           },
//         },
//       },
//     });

//     if (!classData) {
//       return res.status(404).json({ message: "Class not found" });
//     }

//     // Kirim data kelas beserta informasi teacher dan materials sebagai respons
//     res.status(200).json(classData);
//   } catch (error) {
//     console.error("Error fetching class data:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const enteredClass = async (req, res) => {
//   const { class_id } = req.params;

//   try {
//     // Mengambil data kelas beserta informasi teacher dari user collection
//     const classData = await prisma.class.findUnique({
//       where: {
//         id: class_id,
//       },
//       include: {
//         teacher: {
//           // Mengambil data terkait dari model User berdasarkan teacher_id
//           select: {
//             name: true,
//             profile_picture: true,
//           },
//         },
//       },
//     });

//     if (!classData) {
//       return res.status(404).json({ message: "Class not found" });
//     }

//     // Kirim data kelas beserta informasi teacher sebagai respons
//     res.status(200).json(classData);
//   } catch (error) {
//     console.error("Error fetching class data:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const updateClass = async (req, res) => {
//   const { id } = req.params;
//   const { name, description, teacher_id, students, materials, quizzes } =
//     req.body;

//   try {
//     const updatedClass = await prisma.class.update({
//       where: { id },
//       data: {
//         name,
//         description,
//         teacher_id,
//         students: {
//           set: students.map((studentId) => ({ id: studentId })),
//         },
//         materials: {
//           set: materials.map((materialId) => ({ id: materialId })),
//         },
//         quizzes: {
//           set: quizzes.map((quizId) => ({ id: quizId })),
//         },
//       },
//     });

//     res.status(200).json({
//       success: true,
//       message: "Class updated successfully",
//       data: updatedClass,
//     });
//   } catch (error) {
//     console.error("Error updating class:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// };

// Edit Class Endpoint (GET)
// const { ObjectId } = require("mongodb"); // Pastikan library mongodb terpasang

// const getClassForEdit = async (req, res) => {
//   try {
//     const { classId } = req.params;
//     console.log("classId:", classId);

//     // Validasi ObjectId
//     if (!ObjectId.isValid(classId)) {
//       return res.status(400).json({ message: "Invalid class ID format" });
//     }

//     // Cari class berdasarkan ID
//     const classData = await prisma.class.findUnique({
//       where: { id: classId },
//     });

//     // include: {
//     //   id: true,
//     //   name: true,
//     //   description: true,
//     //   teacher_id: true,
//     //   students: true,
//     //   materials: true,
//     //   quizzes: true,
//     // },

//     if (!classData) {
//       return res.status(404).json({
//         success: false,
//         message: "Class not found",
//       });
//     }

//     // Ambil data username untuk students dan title untuk materials & quizzes
//     const studentUsernames = await prisma.user.findMany({
//       where: { id: { in: classData.students.map((student) => student.id) } },
//       select: { id: true, username: true },
//     });

//     const materialTitles = await prisma.material.findMany({
//       where: { id: { in: classData.materials.map((material) => material.id) } },
//       select: { id: true, title: true },
//     });

//     const quizTitles = await prisma.quiz.findMany({
//       where: { id: { in: classData.quizzes.map((quiz) => quiz.id) } },
//       select: { id: true, title: true },
//     });

//     // Kirimkan data yang sudah diproses ke frontend
//     res.status(200).json({
//       success: true,
//       data: {
//         ...classData,
//         students: studentUsernames,
//         materials: materialTitles,
//         quizzes: quizTitles,
//       },
//     });
//   } catch (error) {
//     console.error("Error getting class for edit:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };

module.exports = {
  findClass,
  detailClass,
  addClass,
  deleteClass,
  enteredClass,
  updateClass,
  getClassForEdit,
};
