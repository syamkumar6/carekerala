const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    username: {
        type: String,
        unique: true,
        default: function () {
            return this.name.toLowerCase().replace(/\s+/g, '') + Date.now();
        }
    },
});


const User = mongoose.model("User", UsersSchema);

module.exports = User;