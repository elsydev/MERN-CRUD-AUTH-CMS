import mongoose from "mongoose";

const conectarDB = async () => {
  console.log(process.env.MONGO_URI);
  try {
    const connection = await mongoose.connect(
      "mongodb+srv://root:CagatinA.-2122@mern-login.kwhfy.mongodb.net/?retryWrites=true&w=majority&appName=mern-login",
      {
      
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(`MongoDB conectado en: ${url}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};
export default conectarDB;
