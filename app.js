const express= require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");

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



app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})

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
app.get("/listings",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
})


//new Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//Show Route
app.get("/listings/:id",async(req,res)=>{
    let{id}=req.params;
    const listing =await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
})

//create Route
app.post("/listings",async(req,res)=>{
    const newListing=new Listing(req.body.listing);
    console.log(req.body);
    await newListing.save();
    res.redirect("/listings");
})

// Edit Route
app.get("/listings/:id/edit",async(req,res)=>{
  let {id}=req.params;
  const listing= await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});  
})

// Update Route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    console.log(req.body.listing);
    await  Listing.findByIdAndUpdate(id, req.body.listings);
    res.redirect(`/listings/${id}`);
})
//Delete Route

app.delete("/listings/:id",async(req,res)=>{
    let{id}=req.params;
    let deletedListing =await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})




