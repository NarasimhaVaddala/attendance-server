import AuthModel from "../Modals/AuthModal.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import OtpModel from "../Modals/OtpModal.js";

export const sendOtp = async (req, res) => {
  const { mobile } = req.body;
  console.log(mobile);
  if (!mobile) {
    return res.status(400).json({ message: "Mobile number is required" });
  }

  try {
    const otpExist = await OtpModel.findOne({ mobile: mobile });
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpApiUrl = `https://2factor.in/API/V1/${process.env.OTP_API_KEY}/SMS/+91${mobile}/${otp}/OTP TEMPLATE`;
    try {
      // Send OTP using Axios GET request
      await axios.get(otpApiUrl);

      if (otpExist) {
        // Update the existing OTP document
        otpExist.otp = otp;
        await otpExist.save();
      } else {
        // Create a new OTP document
        const newOtp = new OtpModel({ mobile, otp });
        await newOtp.save();
      }

      return res.status(200).json({ message: "OTP sent successfully!" });
    } catch (error) {
      console.error("Error sending OTP:", error);
      return res.status(500).json({
        message: "Sending OTP failed due to an external server error",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Error finding/updating OTP:", error);
    return res
      .status(500)
      .json({ message: "OTP send failed", error: error.message });
  }
};

// verifycation otp
export const onVerificationOtp = async (req, res) => {
  
  const { mobile, otp,  } = req.body;
  
  console.log(mobile ,otp);
  if (!mobile) {
    return res.status(400).json({ message: "Please send mobile number..!" });
  }
  if (!otp) {
    return res.status(400).json({ message: "Please send otp ..!" });
  }

  try {
    const existingOtpEntry = await OtpModel.findOne({ mobile });
    if (!existingOtpEntry) {
      return res.status(401).json({ message: "User not found in database" });
    }

    if (existingOtpEntry.otp.toString() !== otp.toString()) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    return res.status(200).json({ message: "OTP Verified Success..!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error during OTP verification",
      error: error.message,
    });
  }
};

export const onRegister = async (req, res) => {
  const { name, email,mobile, password,emp_id } = req.body;
  try {
    const doc = {
      name,
      email,
      password,
      emp_id,
      mobile
    };

    const result = await AuthModel.findOne({ email });
    if(result)return res.status(400).send({success:false , error:"user already exists!"})
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
    if (!result)return res.status(401).send({success:false , error:"Invalid Credentials"})
    if (result.password === password) {
      const payload = { email: email };
      const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET);
      return res.status(200).json({success:true ,  token, role :result.role , emp_id:result.emp_id  });
    } else {
      return res.status(401).json({success:false , error:"Invalid Credentials"});
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const onChangePassword = async(req,res)=>{
  const {mobile , password} = req.body;
  console.log(mobile , password);

  try {
    if (!password || !mobile) return res.status(401).send({message:"Password is Required"})
    const result = await AuthModel.findOne({mobile:mobile})
     console.log(result);
  
    if(!result) return res.status(400).send({success:false ,message: "User Not Found"})
    result.password = password;
    await result.save();  
    return res.status(200).send({success:true , message:"Password Changed Successfully"})
  } catch (error) {
    console.log(error);
    return res.status(500).json({success:false , error: "Server error" });
  
  }
}