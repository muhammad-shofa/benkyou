const express = require("express");
const app = express();
const { Buffer } = require("buffer");

// import PrismaClient
const { PrismaClient } = require("@prisma/client");
//  init prisma client
const prisma = new PrismaClient();

const { MongoClient, ObjectId } = require("mongodb");
// const { buffer } = require("stream/consumers");

// FUNCTION TO FIND ALL CLASS WITHOUT PRISMA START
// FUNCTION TO FIND ALL CLASS WITHOUT PRISMA START
// FUNCTION TO FIND ALL CLASS WITHOUT PRISMA START
// FUNCTION TO FIND ALL CLASS WITHOUT PRISMA START

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

// const mongoUri = "mongodb://localhost:27017";
// const dbName = "benkyou"; // Ganti dengan nama database

//  Function to find all materials
const findMaterials = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("benkyou"); // Sesuaikan dengan nama database Anda
    const materialsCollection = db.collection("materials");

    // Mengambil semua materi dari database dan mengurutkannya berdasarkan `create_at`
    const materials = await materialsCollection
      .find({})
      .sort({ create_at: -1 })
      .toArray();

    // Mengirimkan response
    res.status(200).send({
      success: true,
      message: "Get All Materials Successfully",
      data: materials,
    });

    // console.log("Materials", materials);
  } catch (error) {
    console.log("Error", error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
    });
  } finally {
    await client.close(); // Pastikan untuk menutup koneksi
  }
};

// Function untuk mengambil data material berdasarkan banyak ID
const getMaterialsByIds = async (req, res) => {
  const { ids } = req.body; // Mendapatkan array ID dari request body
  try {
    // Konversi array ID menjadi ObjectId
    const objectIds = ids.map((id) => new ObjectId(id));

    // Akses koleksi materials menggunakan MongoDB Driver
    const materials = await req.db
      .collection("materials")
      .find({ _id: { $in: objectIds } })
      .toArray();

    // Kirim hasil sebagai respons
    res.json(materials);
  } catch (error) {
    // Tangani error jika terjadi
    res.status(500).json({ error: "Failed to fetch materials" });
    console.error(error);
  }
};

const createMaterial = async (req, res) => {
  try {
    const { teacher_id, title, content_type, content_text } = req.body; // ini yang asli
    // const {
    //   teacher_id,
    //   title,
    //   content_type,
    //   content_text,
    //   originalname,
    //   mimetype,
    //   buffer,
    // } = req.body;
    // console.log(teacher_id);
    // console.log(title);
    // console.log(content_type);
    // console.log(content_text);
    // console.log(originalname);
    // console.log(mimetype);
    // console.log(buffer);
    // Koneksi MongoDB
    // const client = new MongoClient(mongoUri);
    // await client.connect();
    // const db = client.db(dbName);

    await client.connect();
    const db = client.db("benkyou"); // Sesuaikan dengan nama database Anda
    const materialsCollection = db.collection("materials");

    let newMaterial;

    if (content_type === "text") {
      // Simpan konten teks
      const result = await materialsCollection.insertOne({
        teacher_id,
        title,
        content_type,
        content_text,
        create_at: new Date(),
      });
      newMaterial = result;
    } else if (content_type === "pdf") {
      const { originalname, mimetype, buffer } = req.file;

      // Simpan file PDF
      const result = await materialsCollection.insertOne({
        teacher_id,
        title,
        content_type,
        name_pdf: originalname,
        data_pdf: buffer,
        mimetype_pdf: mimetype,
        create_at: new Date(),
      });
      newMaterial = result;
    }

    res.status(201).json({ success: true, data: newMaterial });
    await client.close(); // Tutup koneksi setelah selesai
  } catch (error) {
    console.error("Error creating material:", error);
    res
      .status(500)
      .json({ success: false, message: "Error creating material" });
  }
};

const downloadPdf = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID:", id);

    // Koneksi MongoDB
    // const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db("benkyou");
    const materialsCollection = db.collection("materials");

    const material = await materialsCollection.findOne({
      _id: new ObjectId(id),
    });

    console.log("Data Material yang didapatkan:", material);

    if (!material) {
      await client.close();
      return res.status(404).send("Material not found");
    }

    res.set("Content-Type", "application/pdf"); // Pastikan mimetype PDF
    res.set(
      "Content-Disposition",
      `attachment; filename="${material.name_pdf}"`
    );

    // res.set("Content-Type", material.mimetype_pdf);
    // res.set(
    //   "Content-Disposition",
    //   `attachment; filename="${material.name_pdf}"`
    // );
    // res.send(material.data_pdf);
    // res.send(material.data_pdf);
    // console.log("Material PDF Buffer:", material.data_pdf);
    // res.send(Buffer.from(material.data_pdf, "base64"));
    res.send(material.data_pdf.buffer); // Ubah Binary ke Buffer dan kirimkan

    res.end(); // Akhiri response setelah mengirim data

    await client.close(); // Tutup koneksi setelah selesai
  } catch (error) {
    console.error("Error fetching material:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Delete material by ID
const deleteMaterial = async (req, res) => {
  // const client = new MongoClient("mongodb://localhost:27017"); // Sesuaikan URI dengan konfigurasi MongoDB-mu
  try {
    await client.connect();

    const db = client.db("benkyou"); // Ganti dengan nama database-mu
    const materials = db.collection("materials"); // Ganti dengan nama koleksi-mu

    // Menghapus dokumen berdasarkan ID
    const result = await materials.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Material not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Material deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  } finally {
    await client.close(); // Tutup koneksi MongoDB
  }
};

// Fungsi untuk membuat material baru
// const createMaterial = async (req, res) => {
//   try {
//     const { teacher_id, title, content_type, content_text } = req.body;
//     await client.connect();
//     const db = client.db("benkyou"); // Sesuaikan dengan nama database Anda

//     let newMaterial;

//     if (content_type === "text") {
//       // Simpan konten teks
//       newMaterial = await req.db.collection("materials").insertOne({
//         teacher_id,
//         title,
//         content_type,
//         content_text,
//         created_at: new Date(),
//       });
//     } else if (content_type === "pdf") {
//       const { originalname, mimetype, buffer } = req.file;

//       // Simpan file PDF
//       newMaterial = await req.db.collection("materials").insertOne({
//         teacher_id,
//         title,
//         content_type,
//         name_pdf: originalname,
//         data_pdf: buffer,
//         mimetype_pdf: mimetype,
//         created_at: new Date(),
//       });
//     }

//     res.status(201).json({ success: true, data: newMaterial.ops[0] });
//   } catch (error) {
//     console.error("Error creating material:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error creating material" });
//   }
// };

// // Fungsi untuk mengunduh file PDF dari koleksi materials
// const downloadPdf = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Cari material berdasarkan ID
//     const material = await req.db
//       .collection("materials")
//       .findOne({ _id: new ObjectId(id) });

//     if (!material) {
//       return res.status(404).send("Material not found");
//     }

//     if (material.content_type !== "pdf") {
//       return res.status(400).send("Requested material is not a PDF");
//     }

//     res.set("Content-Type", material.mimetype_pdf);
//     res.set(
//       "Content-Disposition",
//       `attachment; filename="${material.name_pdf}"`
//     );
//     res.send(material.data_pdf);
//   } catch (error) {
//     console.error("Error fetching material:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// FUNCTION TO FIND ALL CLASS WITHOUT PRISMA END
// FUNCTION TO FIND ALL CLASS WITHOUT PRISMA END
// FUNCTION TO FIND ALL CLASS WITHOUT PRISMA END
// FUNCTION TO FIND ALL CLASS WITHOUT PRISMA END

// function findUsers
// const findMaterials = async (req, res) => {
//   try {
//     // get all users from database
//     const materials = await prisma.material.findMany({
//       orderBy: {
//         create_at: "desc",
//       },
//     });

//     // send response
//     res.status(200).send({
//       success: true,
//       message: "Get All Posts Successfully",
//       data: materials,
//     });
//   } catch (error) {
//     console.log("Error", error);
//     res.status(500).send({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// function untuk mengambil data material berdasarkan banyak id
// const getMaterialsByIds = async (req, res) => {
//   const { ids } = req.body;
//   try {
//     const materials = await prisma.material.findMany({
//       where: {
//         id: { in: ids },
//       },
//     });

//     res.json(materials);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fecth user" });
//     console.log(error);
//   }
// };

// const createMaterial = async (req, res) => {
//   try {
//     // Ambil data dari body request
//     const {
//       teacher_id,
//       title,
//       content_type,
//       content_text,
//       name_pdf,
//       data_pdf,
//       mimetype_pdf,
//     } = req.body;

//     // Validasi data yang diperlukan
//     if (!teacher_id || !title || !content_type) {
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
//         content_text,
//         name_pdf,
//         data_pdf,
//         mimetype_pdf,
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

// const deleteMaterial = async (req, res) => {
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

// dari chat
// buat material baru
// const createMaterial = async (req, res) => {
//   try {
//     const { teacher_id, title, content_type, content_text } = req.body;

//     let newMaterial;

//     if (content_type === "text") {
//       // Simpan konten teks
//       newMaterial = await prisma.material.create({
//         data: {
//           teacher_id,
//           title,
//           content_type,
//           content_text,
//         },
//       });
//     } else if (content_type === "pdf") {
//       const { originalname, mimetype, buffer } = req.file;

//       // Simpan file PDF
//       newMaterial = await prisma.material.create({
//         data: {
//           teacher_id,
//           title,
//           content_type,
//           name_pdf: originalname,
//           data_pdf: buffer,
//           mimetype_pdf: mimetype,
//         },
//       });
//     }

//     res.status(201).json({ success: true, data: newMaterial });
//   } catch (error) {
//     console.error("Error creating material:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error creating material" });
//   }
// };

// // download pdf dari collection material
// const downloadPdf = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const material = await prisma.material.findUnique({
//       where: { id },
//     });

//     if (!material) {
//       return res.status(404).send("Material not found");
//     }

//     res.set("Content-Type", material.mimetype_pdf);
//     res.set(
//       "Content-Disposition",
//       `attachment; filename="${material.name_pdf}"`
//     );
//     res.send(Buffer.from(material.data_pdf, "base64"));
//   } catch (error) {
//     console.error("Error fetching material:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

module.exports = {
  findMaterials,
  createMaterial,
  deleteMaterial,
  downloadPdf,
  getMaterialsByIds,
};
