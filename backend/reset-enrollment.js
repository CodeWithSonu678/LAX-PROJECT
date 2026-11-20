require("dotenv").config();

const mongoose = require("mongoose");

const ManufacturedDevice = require("./src/models/ManufacturedDevice");
const EnrollmentSession = require("./src/models/EnrollmentSession");

async function reset() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    const serialNumber = "LAX-SN-CF5A85A2574A2212935B14F8";

    await EnrollmentSession.deleteMany({
      serialNumber,
      status: "pending"
    });

    await ManufacturedDevice.updateOne(
      {
        serialNumber,
        status: "provisioning"
      },
      {
        $set: { status: "unregistered" }
      }
    );

    console.log("Enrollment reset successful!");

  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
}

reset();