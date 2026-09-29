const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const mongoose = require("mongoose");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// MongoDB connection
main()
    .then(() => {
        console.log("connection successful");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(
        process.env.MONGO_URL || "mongodb://127.0.0.1:27017/whatsapp"
    );
}

// Health check for Kubernetes
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

// Readiness check for Kubernetes
app.get("/ready", (req, res) => {
    if (mongoose.connection.readyState === 1) {
        res.status(200).send("Ready");
    } else {
        res.status(503).send("Not Ready");
    }
});

// Redirect root route to the actual application
app.get("/", (req, res) => {
    res.redirect("/chats");
});

// Index route to view all chats
app.get("/chats", async (req, res) => {
    let chats = await Chat.find();
    res.render("index.ejs", { chats });
});

// New route to create chats
app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
});

// Create route
app.post("/chats", (req, res) => {
    let { from, msg, to } = req.body;

    let newChat = new Chat({
        from: from,
        msg: msg,
        to: to,
        created_at: new Date(),
    });

    newChat
        .save()
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            console.log(err);
        });

    res.redirect("/chats");
});

// Edit route to edit chat
app.get("/chats/:id/edit", async (req, res) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);

    res.render("edit.ejs", { chat });
});

// Update route
app.put("/chats/:id", async (req, res) => {
    let { id } = req.params;
    let { msg: newmsg } = req.body;

    let updatedChat = await Chat.findByIdAndUpdate(
        id,
        { msg: newmsg },
        { runValidators: true, new: true }
    );

    console.log(updatedChat);

    res.redirect("/chats");
});

// Delete route
app.delete("/chats/:id", async (req, res) => {
    let { id } = req.params;

    let deletedChat = await Chat.findByIdAndDelete(id);

    console.log(deletedChat);

    res.redirect("/chats");
});

// Start server
app.listen(port, () => {
    console.log("app is listening on port:", port);
});

