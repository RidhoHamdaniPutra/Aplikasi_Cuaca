const path = require("path");
const express = require("express");
const hbs = require("hbs");

const geocode = require("./utils/geocode");
const forecast = require("./utils/prediksiCuaca");
const getBerita = require("./utils/berita");


const app = express();
const port = process.env.PORT || 4000;

// Mendefinisikan path untuk konfigurasi Express
const directoryPublic = path.join(__dirname, "../public");
const directoryViews = path.join(__dirname, "../templates/views");
const directoryPartials = path.join(__dirname, "../templates/partials");

// Setup handlebars engine dan lokasi views
app.set("view engine", "hbs");
app.set("views", directoryViews);
hbs.registerPartials(directoryPartials);
hbs.registerHelper('eq', function (a, b) {
  return a === b;
});

// Setup direktori untuk file statis
app.use(express.static(directoryPublic));

//ini halaman/page utama
app.get("", (req, res) => {
  res.render("index", {
    judul: "Aplikasi Cek Cuaca",
    nama: "Ridho Hamdani Putra",
  });
});

//ini halaman bantuan/FAQ (Frequently Asked Questions)
app.get("/bantuan", (req, res) => {
  res.render("bantuan", {
    judul: "Bantuan",
    teksBantuan: "Ini adalah teks bantuan",
    nama: "Ridho Hamdani Putra",
  });
});

//ini halaman tentang
app.get("/tentang", (req, res) => {
  res.render("tentang", {
    judul: "Tentang Saya",
    nama: "Ridho Hamdani Putra",
  });
});

//ini halaman info cuaca
app.get("/infocuaca", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "Kamu harus memasukan lokasi yang ingin dicari",
    });
  }
  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }
    forecast(latitude, longitude, (error, dataPrediksi) => {
      if (error) {
        return res.send({ error });
      }
      res.send({
        prediksiCuaca: dataPrediksi,
        lokasi: location,
        address: req.query.address,
      });
    });
  }
  );
});

app.get("/berita", (req, res) => {
  const keyword = req.query.keyword || "";
  const category = req.query.category || "";

  getBerita(keyword, category, (error, dataBerita) => {
    if (error) {
      return res.render("berita", {
        judul: "Berita Terkini",
        nama: "Ridho Hamdani Putra",
        news: null,
        pesanError: error,
        keyword,
        category
      });
    }

    res.render("berita", {
      judul: "Berita Terkini",
      nama: "Ridho Hamdani Putra",
      news: dataBerita,
      keyword,
      category
    });
  });
});


app.get("/bantuan/tes", (req, res) => {
  res.render("404", {
    judul: "404",
    nama: "Ridho Hamdani Putra",
    pesanKesalahan: "Artikel yang dicari tidak ditemukan",
  });
});

app.get("/tes", (req, res) => {
  res.render("404", {
    judul: "404",
    nama: "Ridho Hamdani Putra",
    pesanKesalahan: "Halaman Tidak Ditemukan",
  });
});

app.listen(port, () => {
  console.log('Server berjalan pada port ' + port);
})