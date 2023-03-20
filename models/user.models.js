const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const PRIVATEKEY = 'meomeomeo';
const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    'name': String,
    'email': {type: String, unique: true, require: true},
    'password': String,
    'phone': String,
    'role': String
});

const User = mongoose.model("User", UserSchema);

exports.isExisted = async email => {
    try {
        const data = await User.findOne({email});
        if(!data) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.log(error);
    }
}

//get all Users
exports.getAllUsers  = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        console.log(error);
    }
};

//get User
exports.getUser = async (email) => {
    try {
        const user = await User.findOne({email});
        return user;
    } catch (error) {
        console.log(error);
    }
};

//add a new user
exports.addNewUser = async (name, email, password, phone, role) => {
    const user = new User({name, email, password, phone, role});
    try {
        await user.save();
    } catch (error) {
        console.log(error);
    }
};

//update an existed user
exports.updateUser = async (email, password) => {
    try {
        await User.updateOne({email}, {$set: {password}});
    } catch (error) {
        console.log(error);
    }
};

//delete an existed user
exports.deleteUser = async (email) => {
    try {
        await User.deleteOne({email});
    } catch (error) {
        console.log(error);
    }
};

//user sign in
exports.userSignin = async (email, password) => {
    const user = await this.getUser(email);
    const hashedpwrd = user.password;
    if(bcrypt.compareSync(password, hashedpwrd)) {
        const token = jwt.sign({'email': email, 'role': user.role,
        'name': user.name, 'phone':user.phone}, PRIVATEKEY);
        return token;
    }
    return null;
}

