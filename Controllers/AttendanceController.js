import AttendanceModel from "../Modals/AttendanceModal.js";
import AuthModel from "../Modals/AuthModal.js";

export const onStartingAttendance = async (req, res) => {
  const { date, startTime,emp_id } = req.body;
  const { user } = req;
  try {
    const doc = {
      name:user.name,
      date,
      startTime,
      emp_id,
      head: user._id,
    };

    console.log(doc);
    

    const addAttendance = new AttendanceModel(doc);

    await addAttendance.save();
    res.status(201).json({ message: "Attendance added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const onEndAttendance = async (req, res) => {
  const { endTime  } = req.body;
  const { attendanceId } = req.params;
  try {

    const startTime = await AttendanceModel.findOne({_id : attendanceId})

    let diff = calculateTimeDifference(startTime.startTime , endTime)

 
  const updatedAttendance = await AttendanceModel.findByIdAndUpdate(
      attendanceId,
      { endTime , noOfHours:diff },
      
      { new: true }
    );
    if (!updatedAttendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    res.status(200).json({success:true ,  message: "Attendance updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const onStateAttendance = async (req, res) => {
  const { user } = req;
  try {
    const thisuser = await AuthModel.findOne({_id:user._id})
    const allAttendance = await AttendanceModel.find({ head: user._id }).sort({
      createdAt: -1
    });
    if (!allAttendance || !thisuser) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    
    
    res.status(200).json({ success:true , attendance:allAttendance , details:{name:thisuser.name , id:thisuser.emp_id}});

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};





export const adminAttendance = async (req,res)=>{
  try {
    const allAttendance = await AttendanceModel.find().sort({
      createdAt: -1
    });
  
    return res.status(200).send({success:true , data:allAttendance})
  } catch (error) {
    return res.status(500).send({success:false , error:error.message})
    
  }
}

// !Required Funcitons to Format time


const convertTo24HourFormat = (time12h) => {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') {
      hours = '00';
  }

  if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
};

const calculateTimeDifference = (startTime, endTime) => {
  // Convert both times to 24-hour format
  const start = convertTo24HourFormat(startTime);
  const end = convertTo24HourFormat(endTime);

  // Parse the times into Date objects (using a dummy date)
  const startDate = new Date(`01/01/2000 ${start}`);
  const endDate = new Date(`01/01/2000 ${end}`);

  // Calculate the difference in milliseconds
  const diffInMilliseconds = endDate - startDate;

  // Convert milliseconds to total minutes
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));

  // Extract hours and minutes
  const diffInHours = Math.floor(diffInMinutes / 60);
  const remainingMinutes = diffInMinutes % 60;

  return `${diffInHours}H : ${remainingMinutes}M`;
};


export const onFetchAllStudents = async (req, res) => {
  try {
    const students = await AuthModel.find({})
    return res.status(200).json(students)
  } catch (error) {
    console.log(error)
    return res.status(500).json({message : "internal server errr", error})
  }
}