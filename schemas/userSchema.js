import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

//plugin automatically username, salt, hash add krdega passwrd m, scratch se build ni krna pdega
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
export default User;