import AuthModel from "../Modals/AuthModal.js";
import jwt from "jsonwebtoken";
export const onRegister = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const doc = {
      name,
      email,
      password,
    };

    const user = new AuthModel(doc);
    await user.save();
    return res.status(201).json({success:true , message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const onLoginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await AuthModel.findOne({ email });
    if (result.password === password) {
      const payload = { email: email };
      const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET);
      return res.status(200).json({success:true ,  token });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};
