const request = require("postman-request");

const getBerita = (keyword = "", category = "", callback) => {
    let url = `http://api.mediastack.com/v1/news?access_key=dce1b7dd16aba7d83c00387268038910&limit=6`;

    if (keyword) {
        url += `&keywords=${encodeURIComponent(keyword)}`;
    }

    if (category) {
        url += `&categories=${encodeURIComponent(category)}`;
    }

    request({ url: url, json: true }, (error, response) => {
        if (error) {
            callback("Tidak dapat terhubung ke layanan berita", undefined);
        } else if (response.body.error) {
            callback("Terjadi kesalahan dalam mengambil data berita", undefined);
        } else if (!response.body.data || response.body.data.length === 0) {
            callback("Tidak ada berita yang tersedia untuk pencarian ini", undefined);
        } else {
            callback(undefined, response.body.data);
        }
    });
};

module.exports = getBerita;
