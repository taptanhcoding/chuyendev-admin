const mongoose = require("mongoose");
const URL = "mongodb+srv://chuyendev:Lechuyen1998@mydatabase.kvi0qmb.mongodb.net/?retryWrites=true&w=majority";

async function connect() {
  try {
    await mongoose.connect(URL,{ useNewUrlParser: true, useUnifiedTopology: true});
    console.log("connect successfully");
  } catch (error) {
    console.log("connect failure");
    console.log(error);
    process.exit(1);
  }
}

module.exports = { connect };
