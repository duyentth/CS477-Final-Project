const mongoose = require('mongoose');
const User = require('./user.models');
const Device = require('./device.models');

const apartmentSchema = mongoose.Schema({
    'code': {type: String, unique: true, require: true},
    'capacity': Number,
    'vacancies': Number,
    'residents': [{type: String, ref: 'User'}],
    'device': [{type: String, ref:'Device'}]
});

const Apartment = mongoose.model('Apartment', apartmentSchema);

//add a new Apartment
exports.addNewApartment = async (code, capacity, vacancies) => {
    try {
        const apartment = new Apartment({code, capacity, vacancies});
        await apartment.save();
    } catch (error) {
        console.log(error);
    }
};

//get all apartments
exports.getAllApartments = async () => {
    try {
        const apartments = await Apartment.find();
        return apartments;
    } catch (error) {
        console.log(error);
    }
};

//get an existed Apartment
exports.getExistedApartment = async code => {
    try {
        const apartment = await Apartment.findOne({code});
        return apartment;
    } catch (error) {
        console.log(error);
    }
};

//update an existed Apartment
exports.updateApartment = async (code) => {
    try {
        
    } catch (error) {
        console.log(error);
    }
};

//delete an existed Apartment
exports.deleteApartment = async (code) => {
    try {
        
    } catch (error) {
        console.log(error);
    }
};

//check whether a code is existed or not
exports.isExisted = async code => {
    try {
        const data = await Apartment.findOne({code});
        if( !data ) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.log(error);
    }
}