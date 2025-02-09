/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";


function Landing() {
  const navigate = useNavigate;

  

  // const try_now = () => {
    
  // }

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <canvas className="background"></canvas>
      <div
        id="home"
        className="flex justify-center items-center text-center min-h-[850px]"
      >
        <div className="text-hero">
          <h1 className="text-5xl mb-6 leading-[80px]">
            <b className="bg-[#7752FE] text-white">Belajar</b> Dan{" "}
            <b className="bg-[#7752FE] text-white">Mengajar</b> Kapan Saja,{" "}
            <br /> di Mana Saja, Bersama{" "}
            <b className="bg-slate-200 text-[#7752FE]">Benkyou.</b>
          </h1>
          <div className="button-hero flex justify-center gap-4">
            <button
              className="p-2 text-lg font-bold duration-200 border-2 border-[#361f8e] bg-white text-[#361f8e] hover:bg-[#361f8e] hover:text-white"
            >
              Coba Sekarang
            </button>
            <button className="bg-[#361f8e] p-2 text-white text-lg font-bold duration-200 border-2 border-[#361f8e] hover:bg-white hover:text-[#361f8e]">
              Lihat Lebih Lanjut
            </button>
          </div>
        </div>
      </div>

      {/* feature */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="mt-[-200px]"
      >
        <path
          fill="#361f8e"
          fillOpacity="1"
          d="M0,160L40,165.3C80,171,160,181,240,160C320,139,400,85,480,90.7C560,96,640,160,720,181.3C800,203,880,181,960,144C1040,107,1120,53,1200,42.7C1280,32,1360,64,1400,80L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
        ></path>
      </svg>
      <div
        id="feature"
        className="text-center text-white gap-5 px-5 py-10 mt-[-2px] min-h-[700px] bg-[#361f8e]"
      >
        <div className="text-feature-1 rounded-lg h-fit p-2 max-w-[450px] mb-10 mx-auto">
          <h1 className="text-2xl mb-2">Kemudahan dalam mengakses materi</h1>
          <p>
            Belajar jadi lebih mudah dengan akses materi kapan saja dan di mana
            saja. Materi disusun sistematis, dokumen dan kuis interaktif.
            Nikmati pengalaman belajar fleksibel di laptop, tablet, atau
            ponselmu. Ayo belajar dan raih potensi terbaikmu!.
          </p>
        </div>
        <div className="all-card-feature flex justify-evenly flex-wrap gap-5">
          <div className="card-feature min-h-[240px] rounded-lg h-fit p-5 max-w-[340px] bg-[#7752FE] duration-150 hover:cursor-pointer hover:bg-white hover:text-[#7752FE]">
            <i className="fa-solid fa-graduation-cap text-[40px]"></i>
            <h1 className="text-2xl my-3">
              Ruangan Kelas Privat untuk Pembelajaran yang Eksklusif
            </h1>
            <p>
              Buat ruang kelas privat untuk pembelajaran yang lebih lebih fokus
              dan terarah.
            </p>
          </div>
          <div className="card-feature min-h-[240px] rounded-lg h-fit p-5 max-w-[340px] bg-[#7752FE] duration-150 hover:cursor-pointer hover:bg-white hover:text-[#7752FE]">
            <i className="fa-solid fa-graduation-cap text-[40px]"></i>
            <h1 className="text-2xl my-3">Kemudahan Akses</h1>
            <p>Akses kelas dan materi dengan lebih cepat melalui dashboard.</p>
          </div>
          <div className="card-feature min-h-[240px] rounded-lg h-fit p-5 max-w-[340px] bg-[#7752FE] duration-150 hover:cursor-pointer hover:bg-white hover:text-[#7752FE]">
            <i className="fa-solid fa-book text-[40px]"></i>
            <h1 className="text-2xl my-3">Materi Terstruktur</h1>
            <p>Dapatkan materi yang terstruktur untuk setiap pembelajaran.</p>
            {/* <p></p> */}
          </div>
          <div className="card-feature min-h-[240px] rounded-lg h-fit p-5 max-w-[340px] bg-[#7752FE] duration-150 hover:cursor-pointer hover:bg-white hover:text-[#7752FE]">
            <i className="fa-regular fa-clock text-[40px]"></i>
            <h1 className="text-2xl my-3">
              Belajar Kapan Saja dan di Mana Saja.
            </h1>
            <p>
              Pengelolaan waktu lebih efisien dengan belajar atau mengajar kapan
              saja dan di mana saja!
            </p>
          </div>
          <div className="card-feature min-h-[240px] rounded-lg h-fit p-5 max-w-[340px] bg-[#7752FE] duration-150 hover:cursor-pointer hover:bg-white hover:text-[#7752FE]">
            <i className="fa-regular fa-folder-open text-[40px]"></i>
            <h1 className="text-2xl my-3">
              Kemudahan Menambahkan Materi Pembelajaran
            </h1>
            <p>
              Kebebasan untuk mengunggah berbagai jenis materi, dokumen, video,
              atau modul interaktif, yang mendukung proses belajar mengajar.
            </p>
          </div>
        </div>
      </div>
      {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="mt-[-10px]">
        <path
          fill="#361f8e"
          fillOpacity="1"
          d="M0,160L40,165.3C80,171,160,181,240,160C320,139,400,85,480,90.7C560,96,640,160,720,181.3C800,203,880,181,960,144C1040,107,1120,53,1200,42.7C1280,32,1360,64,1400,80L1440,96L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
        ></path>
      </svg> */}

      {/* About */}
      <div
        id="about"
        className="about flex justify-center items-center text-white text-center gap-5 px-5 py-10 min-h-[600px] bg-[#361f8e]"
        style={{
          backgroundImage: 'url("bg-about-4.jpg")',
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="max-w-[700px]">
          <h1 className="text-3xl mb-2">
            <b>Apa itu Benkyou?</b>
          </h1>
          <p className="text-xl">
            Bankyou adalah platform e-learning inovatif yang dirancang untuk
            memberikan pengalaman belajar yang efektif, fleksibel, dan
            interaktif bagi pengguna. Dengan berbagai materi edukatif yang
            berkualitas, Bankyou membantu siswa, mahasiswa, serta profesional
            dalam mengembangkan keterampilan dan pengetahuan mereka dengan
            mudah.
          </p>
        </div>
      </div>

      {/* Contact */}
      <div id="contact" className="text-white mt-[-2px] min-h-[700px]">
        <div className="header-contact  bg-[#361f8e] px-5 py-10">
          <h1 className="text-3xl mb-2">
            <b>Contact Us</b>
          </h1>
          <p>Have any questions or feedback? Contact us immediately.</p>
        </div>
        <div className="body-contact px-5 py-10 flex justify-evenly items-center bg-white text-black">
          <img src="contact.jpg" alt="contact img" className="w-[400px]" />
          {/* <p className="max-w-[300px]">
            Bankyou adalah platform e-learning inovatif yang dirancang untuk
            memberikan pengalaman belajar yang efektif, fleksibel, dan
            interaktif bagi pengguna. Dengan berbagai materi edukatif yang
            berkualitas, Bankyou membantu siswa, mahasiswa, serta profesional
            dalam mengembangkan keterampilan dan pengetahuan mereka dengan
            mudah.
          </p> */}
          <form
            method="POST"
            action=""
            className="p-[10px] bg-white rounded-md border-2 w-[600px] mt-[-120px]"
          >
            <div className="header-form p-5 mb-3 bg-[#361f8e] rounded-md">
              <h2 className="text-white font-bold text-xl">
                <i className="fa-regular fa-paper-plane text-white text-2xl mx-2"></i>
                Bagaimana proses belajar dan mengajar anda? feedback anda sangat
                penting bagi perkembangan kami.
              </h2>
            </div>
            <div className="name-input-container flex gap-5 mb-[10px]">
              <div className="block w-[100%]">
                <input
                  type="text"
                  name="fname"
                  id="fname"
                  className="bg-slate-100 p-2 rounded w-[100%]"
                  placeholder="First Name"
                />
              </div>
              <div className="block w-[100%]">
                <input
                  type="text"
                  name="lname"
                  id="lname"
                  className="bg-slate-100 p-2 rounded w-[100%]"
                  placeholder="Last Name"
                />
              </div>
            </div>
            <input
              type="email"
              className="bg-slate-100 p-2 rounded w-[100%]"
              placeholder="Your Email"
            />
            <textarea
              style={{ resize: "none" }}
              name="messasge"
              id="message"
              className="bg-slate-100 p-2 mt-3 rounded w-[100%] h-[220px]"
              placeholder="Leave Message Here..."
            ></textarea>
            <button className="bg-[#361f8e] text-white float-end py-2 px-4 mt-3 border-2 border-[#361f8e] rounded hover:bg-white hover:text-[#361f8e]">
              Kirim
            </button>
          </form>
        </div>
      </div>

      {/* footer */}
      <footer
        id="footer"
        className="text-white  bg-slate-900 px-5 pt-[100px] mt-[-2px]"
      >
        <div className="flex flex-wrap gap-5 justify-evenly">
          <div className="about-footer w-[400px]">
            <h1 className="text-xl font-bold">Apa itu Benkyou?</h1>
            <p>
              Bankyou adalah platform e-learning inovatif yang dirancang untuk
              memberikan pengalaman belajar yang efektif, fleksibel, dan
              interaktif bagi pengguna. Dengan berbagai materi edukatif yang
              berkualitas, Bankyou membantu siswa, mahasiswa, serta profesional
              dalam mengembangkan keterampilan dan pengetahuan mereka dengan
              mudah.
            </p>
          </div>
          <div className="link-footer">
            <h1 className="text-xl font-bold">Navigations</h1>
            <ul>
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#feature">Feature</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
              <li>
                <a href="">Login</a>
              </li>
              <li>
                <a href="">Register</a>
              </li>
            </ul>
          </div>
          <div className="contact-footer">
            <h1 className="text-xl font-bold">Our Social Media</h1>
            <ul>
              <li>
                <a href="">Instagram</a>
              </li>
              <li>
                <a href="">Tiktok</a>
              </li>
              <li>
                <a href="">Facebook</a>
              </li>
              <li>
                <a href="">X</a>
              </li>
            </ul>
          </div>
        </div>
        <p className="text-center mt-[100px] pb-[20px]">
          <i className="fa-regular fa-copyright"></i> 2024 Benkyou. All rights
          reserved.
        </p>
      </footer>
    </>
  );
}

export default Landing;
