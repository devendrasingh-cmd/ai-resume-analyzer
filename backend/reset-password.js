const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./src/models/User");

async function resetPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "devendra.test2@gmail.com";
    const newPassword = "Test@12345";

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      console.log("User not found");
    } else {
      console.log("Password reset successfully.");
      console.log("Email:", email);
      console.log("Password:", newPassword);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Password reset failed:", error.message);
    process.exit(1);
  }
}

resetPassword();
