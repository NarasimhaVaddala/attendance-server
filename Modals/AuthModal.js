import mongoose from "mongoose";
const { Schema } = mongoose;

const AuthSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const AuthModel = mongoose.model("Auth", AuthSchema);
export default AuthModel;
