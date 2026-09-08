const mongoose= require("mongoose");
const Schema=mongoose.Schema;

const listingSchema= new Schema({//Schema:blueprint
    title:{
        type:String,
        required:true,
    },
    description: String,
    image:{
        filename: {
        type: String,
        default: "listingimage",
        },
        url: {
         type:String,
         default:"https://i.pinimg.com/originals/57/e4/03/57e40361d7486e564ae934006094c498.jpg",
         set:(v)=> v==="" ? "https://i.pinimg.com/originals/57/e4/03/57e40361d7486e564ae934006094c498.jpg":v,
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews:{
        type: Schema.Types.ObjectId,
        ref:"Review"
    }
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;