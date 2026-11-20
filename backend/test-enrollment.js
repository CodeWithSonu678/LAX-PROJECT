require("dotenv").config();

const mongoose = require("mongoose");

const ManufacturedDevice = require("./src/models/ManufacturedDevice");
const EnrollmentSession = require("./src/models/EnrollmentSession");

const {
  startEnrollment,
} = require("./src/modules/lax-registration/services/enrollment.service");

async function testEnrollment() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    // Apna existing unregistered device use karo
    const device = await ManufacturedDevice.findOne({
      serialNumber: "LAX-SN-CF5A85A2574A2212935B14F8",
      status: "unregistered",
    }).select("+manufacturingCodeHash");

    if (!device) {
      throw new Error("No unregistered manufactured device found.");
    }

    console.log("Serial Number:", device.serialNumber);

    // Yahan manufacturing code enter karo
    const manufacturingCode =
      "BD36358E60105DD79B187A9B0678FFD063F4940FD0B73A06";

    // Apne existing registered user ka MongoDB ObjectId
    const userId = "6adabdd79cb5c13809024824";

    const result = await startEnrollment({
      serialNumber: device.serialNumber,
      manufacturingCode,
      userId,
    });

    console.log("\nEnrollment Result:");
    console.log(result);
  } catch (error) {
    console.error("Enrollment Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

testEnrollment();
