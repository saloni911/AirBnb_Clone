const mongoose=require("mongoose");
const initData = require("./data.js");
const Listing =require("../models/listing.js");
const Mongoose_URL="mongodb://127.0.0.1:27017/wanderlust";
//connect database
main()
 .then(()=>{
    console.log("Database is connected!");
}).catch(()=>{
    console.log("Database is not connected!");
})

async function main(){
    await mongoose.connect(Mongoose_URL);
}

const initDB= async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initialize");
}
initDB();