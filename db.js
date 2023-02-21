const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
mongoose.set("strictQuery", true);
const mongoDB = async () => {
    await mongoose.connect(
        process.env.MONGO_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
        async (err, data) => {
            if (err) console.log(err);
            else {
                console.log("mongodb is connected");
                // const fetched_user_data = await mongoose.connection.db.collection(
                //     "users"
                // );
                // fetched_user_data.find({}).toArray(function (err, userkaData) {
                //     if (err) console.log(err);
                //     else {
                //         global.users = userkaData;
                //     }
                // });
            }
        }
    );
};
module.exports = mongoDB;