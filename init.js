const mongoose = require('mongoose');
const Chat = require('./models/chat.js');

main()
    .then(() => {
        console.log("connection successful");
    })
    .catch(err => console.log(err))

async function main() {
    await mongoose.connect(
        process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/whatsapp'
    );
}

let allChats = [
    {
        from: "neha",
        to: "priya",
        msg: "send me your exam sheets",
        created_at: new Date(),
    },
    {
        from: "rohit",
        to: "mohit",
        msg: "teach me JS callbacks",
        created_at: new Date(),
    },
    {
        from: "gaurav",
        to: "nitish",
        msg: "all the best! for your exam",
        created_at: new Date(),
    },
    {
        from: "nitish",
        to: "gaurav",
        msg: "thank you for your wishes",
        created_at: new Date(),
    },
    {
        from: "kapil",
        to: "harshal",
        msg: "can you give money to me for some days",
        created_at: new Date(),
    },
    {
        from: "dad",
        to: "ankita",
        msg: "bring me some fruits",
        created_at: new Date(),
    },
    {
        from: "jayant",
        to: "bhavesh",
        msg: "i have plan for next trip can you joining as",
        created_at: new Date(),
    },
    {
        from: "lokesh",
        to: "ritesh",
        msg: "give me tips for army prepration",
        created_at: new Date(),
    },
    {
        from: "tony",
        to: "peter",
        msg: "love you 3000",
        created_at: new Date(),
    },
];

Chat.insertMany(allChats);
