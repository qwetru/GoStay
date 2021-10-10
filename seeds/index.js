const mongoose = require('mongoose');
const hotel = require('../models/hotel');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-room', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error...'));
db.once('open', () => {
    console.log('connection Open...')
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const price = Math.floor(Math.random() * 50) + .99;

const seedDB = async () => {
    await hotel.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1k = Math.floor(Math.random() * 1000);
        const h1 = new hotel({
            location: `${cities[random1k].city}, ${cities[random1k].state}`,
            title: `${sample(descriptors)}  ${sample(places)}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1k].longitude,
                    cities[random1k].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dtjtjozdl/image/upload/v1624893274/YelpHotels/ystlyrtkcld4svr6f9fd.jpg',
                    filename: 'YelpHotels/ystlyrtkcld4svr6f9fd'
                },
                {
                    url: 'https://res.cloudinary.com/dtjtjozdl/image/upload/v1624893274/YelpHotels/m2ygspejv2yuctaiwosc.jpg',
                    filename: 'YelpHotels/m2ygspejv2yuctaiwosc'
                }

            ],
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alias dolorem eaque voluptatem eveniet nam veritatis soluta consectetur. Voluptatibus fugiat saepe sed veniam et architecto soluta molestiae, ad accusamus quod accusantium!',
            price,
            owner: '60cb5e8259ee151e38fc9499'
        })
        await h1.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})