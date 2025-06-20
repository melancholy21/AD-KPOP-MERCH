import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id:{ type : String, required: true},
    name:{ type : String, required: true},
    game:{ type : String, required: true, unique:true},
    imageUrl: { type: String, required: true },
    cartItems: { type:Object, default: {} }
}, { minimize: false })

const User = mongoose.models.user || mongoose.model('users', userSchema);

export default User
