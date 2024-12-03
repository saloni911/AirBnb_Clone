const express= require("express");
const app=express();
const mongoose= require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override")
const ejsMate = require("ejs-mate");
const wrapAysnc=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema ,reviewSchema}= require("./schema.js");
const Review = require("./models/reviews.js");
const Mongoose_URL="mongodb://127.0.0.1:27017/wanderlust";
//connect database
main()
 .then(()=>
{
    console.log("Database is connected!");
}).catch(()=>
{
    console.log("Database is not connected!");
})
async function main(){
    await mongoose.connect(Mongoose_URL);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("hello");
})
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el).el.message.join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    } 
};
const validateReview=(req,res,next)=>{
    console.log(`req body : ${req.body.rating}`);
    
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map(el).el.message.join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    } 
};
// app.get("/testlisting", async (req,res)=>
// {
//     let samplelisting = new Listing({
//         title :"My home",
//         description:"By the beach",
//         price:1200,
//         location: "south goa",
//         country:"India"
//     });
//     await samplelisting.save();
//     console.log("sample was test");
//     res.send("sucessfull testing");
// })
//new route 
app.get("/listing/new",(req,res)=>{
    res.render("listing/new.ejs");
})
//create out
app.post("/listing", validateListing,wrapAysnc(async (req,res,next)=>
{
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send the vaild data for listings");
    // }
    const newListings = new Listing(req.body.listing);
    await newListings.save();
    res.redirect("/listing"); 
}));
//Edit route
app.get("/listing/:id/edit",wrapAysnc (async (req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listing/edit.ejs",{listing});
}));
//Update route
app.put("/listing/:id",validateListing,wrapAysnc (async (req,res)=>
{
    if(!req.body.listing){
        throw new ExpressError(400,"send the vaild data for listings");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate( id,{...req.body.listing});
    res.redirect(`/listing/${id}`);
}));
//Delete route
app.delete("/listing/:id",wrapAysnc (async (req,res)=>
{
    let {id}= req.params;
    let DeleteListing = await Listing.findByIdAndDelete(id);
    // console.log(DeleteListing);
    res.redirect("/listing");
}));
app.get("/listing",wrapAysnc (async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listing/index.ejs", { allListings });
}));
//show route 
app.get("/listing/:id", wrapAysnc (async (req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id);
    res.render("listing/show.ejs" ,{listing});
}));
//revivew route 
//post route
app.post("/listing/:id/reviews" , validateReview,async(req,res)=>{
    console.log(1);
    
    let listing= await Listing.findById(req.params.id).populate("reviews");
    console.log(1);
    let newReview=new Review(req.body.review);
    console.log();
    listing.reviews.push(newReview);
    console.log(4);
    await newReview.save();
    console.log(5);
    await listing.save();
    // console.log("review was saved!");
    res.redirect(`/listing/${listing._id}`);
});
app.all("*",(req,res,next)=>{
    next(new ExpressError(404 ,"Page not found!"));
});
app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong!"}=err;
    // res.render("listing/error.ejs",{message});
    // res.status(status).send(message);
});
app.listen(8080,()=>
{
    console.log("server is listening at port 8080");
})