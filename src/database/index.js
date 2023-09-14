import mongoose from "mongoose";

const configOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const connectToDB = async () => {
  const connectionUrl =
    "mongodb+srv://hassaanqaisar2:I1bYIsoY7AJK4hev@cluster0.i6519ta.mongodb.net/";

  mongoose
    .connect(connectionUrl, configOptions)
    .then(() => console.log("Database connected successfully!"))
    .catch((err) =>
      console.log(`Getting Error from DB connection ${err.message}`)
    );
};

export default connectToDB;
