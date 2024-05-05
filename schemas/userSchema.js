import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose"
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose); //applies the passportLocalMongoose plugin to the userSchema, making user authentication easier with Passport.js in Node.js applications
const User = mongoose.model("User", userSchema);
export default User;