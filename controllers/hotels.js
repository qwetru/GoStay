const hotel = require('../models/hotel');
const flash = require('connect-flash');
const { cloudinary } = require('../cloudinary')
const mbxGeoClient = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeoClient({ accessToken: mapboxToken })

module.exports.displayIndex = async (req, res) => {
    const hotels = await hotel.find();
    res.render('hotels/index', { hotels });
}

module.exports.newForm = (req, res) => {
    res.render('hotels/new')
}

module.exports.addHotel = async (req, res) => {
    const geocodes = await geocoder.forwardGeocode({
        query: req.body.hotel.location,
        limit: 1
    }).send()
    const newHotel = await new hotel(req.body.hotel);
    newHotel.geometry = geocodes.body.features[0].geometry;
    newHotel.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newHotel.owner = req.user._id;
    await newHotel.save();
    req.flash('success', 'Hotel added!!');
    res.redirect('/hotels');
}

module.exports.showHotel = async (req, res) => {
    const fhotel = await hotel.findById(req.params.id).populate({
        path: 'reviews',
        populate: { path: 'author' }
    }).populate('user');
    if (!fhotel) {
        req.flash('error', 'Hotel Not Found!!')
        res.redirect('/hotels');
    }
    res.render('hotels/show', { fhotel });
}

module.exports.editForm = async (req, res) => {
    const fhotel = await hotel.findById(req.params.id);
    if (!fhotel) {
        req.flash('error', 'Cannot find Hotel')
        res.redirect('/hotels');
    }
    res.render('hotels/edit', { fhotel });
}

module.exports.updateHotel = async (req, res) => {
    const { id } = req.params;
    const fhotel = await hotel.findByIdAndUpdate(id, { ...req.body.hotel })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    fhotel.images.push(...imgs);
    if (req.body.deleteImage) {
        await fhotel.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImage } } } })
        for (let file of req.body.deleteImage) {
            await cloudinary.uploader.destroy(file);
        }
    }
    await fhotel.save();
    req.flash('success', 'Updated!!');
    res.redirect(`/hotels/${fhotel._id}`);
}

module.exports.deleteHotel = async (req, res) => {
    const { id } = req.params;
    await hotel.findByIdAndDelete(id);
    req.flash('success', 'Deleted!!')
    res.redirect('/hotels');
    console.log(req.method);
}