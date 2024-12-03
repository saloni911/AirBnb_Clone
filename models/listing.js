const mongoose = require("mongoose");
const reviews = require("./reviews");
const { ref } = require("joi");
const Schema = mongoose.Schema;

const ListingSchema = new Schema ({
    title :{
        type:String,
        required: true
    },
    description : String,
    Image:{
        url:{type:String,
            default:"https://www.istockphoto.com/photo/teenager-indian-girl-hiking-on-mountain-with-backpack-in-manali-himachal-pradesh-gm1416018492-464159296?utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fouting&utm_medium=affiliate&utm_source=unsplash&utm_term=outing%3A%3A%3A",
            set:(v)=> v=== "" ? " https://www.istockphoto.com/photo/teenager-indian-girl-hiking-on-mountain-with-backpack-in-manali-himachal-pradesh-gm1416018492-464159296?utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fouting&utm_medium=affiliate&utm_source=unsplash&utm_term=outing%3A%3A%3A" :v,}
        
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
});

const Listing = mongoose.model("Listing",ListingSchema);
module.exports = Listing;