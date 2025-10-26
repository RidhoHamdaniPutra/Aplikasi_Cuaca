const geocode = require('../utils/geocode');
const forecast = require('../utils/prediksiCuaca');

module.exports = (req, res) => {
    const address = req.query.address;

    if (!address) {
        return res.status(400).json({
            error: "Kamu harus memasukan lokasi yang ingin dicari",
        });
    }

    geocode(address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.status(500).json({ error });
        }

        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error) {
                return res.status(500).json({ error });
            }

            res.status(200).json({
                prediksiCuaca: dataPrediksi,
                lokasi: location,
                address: address,
            });
        });
    });
};
