const express= require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/WrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");



const MONGO_URL="mongodb://127.0.0.1:27017/WanderLust"

main()
.then(()=>{console.log("connect to DB");})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


app.get("/",(req,res)=>{
    res.send("Hi I am root");
})

app.get("/testListing",async(req,res)=>{
    let sampleListing=new Listing({
        title:"My New Villa",
        description:"By the beach",
        price:1200,
        location:"Brussels",
        country:"Denmark"
    })
     await sampleListing.save();
     console.log("sample was saved");
     res.send("successful testing");
});

//Index Route
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}))


//new Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//Show Route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const listing =await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
}))

//create Route
app.post("/listings",
   wrapAsync(async(req,res,next)=>{
        console.log("RECEIVED BODY:", req.body);
        if (!req.body.listing) {
            throw new ExpressError(400, "Send valid data for listing!");
        }
         const newListing=new Listing(req.body.listing);
         console.log(req.body);
         await newListing.save();
         res.redirect("/listings"); 
        })
    );

// Edit Route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
  let {id}=req.params;
  const listing= await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});  
}))

// Update Route
app.put("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    console.log(req.body.listing);
    await  Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}))

//Delete Route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    let deletedListing =await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}))

app.all("/{*splat}",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"));
});

app.use((err, req, res, next) => {
    console.error("DEBUG ERROR:", err);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong!";

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map(el => el.message).join(", ");
    }

    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid value for ${err.path}: ${err.value}`;
    }

    res.status(statusCode).send(message);
});
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})



