const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
    'code': String,
    'description': String
});

const Device = mongoose.model('Device', deviceSchema);

//get all devices
exports.getAllDevices = async () => {
    try {
        const devices = await Device.find();
        return devices;
    } catch (error) {
        console.log(error);
    }
};

//get an existed device
exports.getDevice = async (code) => {
    try {
        const device = await Device.findOne({code});
        return device;
    } catch (error) {
        console.log(error);
    }
};

//update an existed device
exports.updateDevice = async (code, description) => {
    try {
        await Device.updateOne({code}, {$set: {description}});
    } catch (error) {
        console.log(error);
    }
};

//delete an existed device
exports.deleteDevice = async (code) => {
    try {
        await Device.deleteOne({code});
    } catch (error) {
        console.log(error);
    }
};

exports.isExisted = async (code) => {
    try {
        const device = await Device.findOne({code});
        console.log("device is ", device);
        if (!device) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.log(error);
    }
}

exports.createDevice = async (code, description) => {
    try {
       const device = new Device({code, description});
       await device.save();
    } catch (error) {
        console.log(error);
    }
}