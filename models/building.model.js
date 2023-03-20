const mongoose = require('mongoose');
const Device = require('./device.models');
const Apartment = require('./apartment.models');
const User = require('./user.models');

const buildingSchema = mongoose.Schema({
    'name': String,
    'code': {type: String, unique: true, require: true},
    'address': String,
    'apartments':[{
        'code': {type: String, unquire: true, require: true},
        'capacity': Number,
        'vacancies': Number,
        'residents': [String],
        'devices': [{
            'code': String,
            'description': String
        }],
    }],    
});

const Building = mongoose.model('Building', buildingSchema);

//check whether a given code is existed or not
exports.isExisted = async code => {
    try {
        const data = await Building.findOne({code});
        if(!data) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        console.log(error);
    }
};

//add a new building(name, code, address)
exports.addNewBuilding = async ( name,code, address) => {
    try {
        const building = new Building({name, code, address});
        await building.save();
    } catch (error) {
        console.log(error);
    }
}

//get all existed buildings
exports.getAllBuildings = async () => {
    try {
        const data = await Building.find();
        return data;
    } catch (error) {
        console.log(error);
    }
}

//get an existed building with the given code
exports.getBuilding = async code => {
    try {
        const data = await Building.findOne({code});
        return data;
    } catch (error) {
        console.log(error);
    }
}

//get all existed apartments
exports.getAllApartments = async buildingcode => {
    try {
        const building = await Building.findOne({'code':buildingcode}); 
        return building.apartments;       
    } catch (error) {
        console.log(error);
    }
}

//get an existed apartment
exports.getApartment = async (code, apartmentcode) => {
    try {
        const apartments = await this.getAllApartments(code);
        for ( let apt of apartments) {
            if (apt.code  === apartmentcode){
                return apt;
            }
        }
       return null;

    } catch (error) {
        console.log(error);
    }
};

//get all existed devices
exports.getAllDevices = async (code, apartmentcode)  => {
    try {
        const apartments =  await this.getAllApartments(code);
        for ( let apt of apartments) {
            if( apt.code === apartmentcode) {
                return apt.devices;
            }
        }
        return null;
    } catch (error) {
        console.log(error);
    }
};


//get an existed devices
exports.getDevices = async (code, apartmentcode, devicecode) => {
    try {
        const devices = await this.getAllDevices(code, apartmentcode);
        for(let d of devices) {
            if(d.code === devicecode) {
                return d;
            }
        }
        return null;
    } catch (error) {
        console.log(error);
    }
}

//update name and address of building
exports.updateExistedBuilding = async (code, address) => {
    console.log(code, address);
    try {
        await Building.updateOne({code}),{$set: {address}};
    } catch (error) {
        console.log(error);
    }
}

//delete an existed buildings

exports.deleteBuilding = async (code) => {
    try {
        await Building.deleteOne({code});
    } catch (error) {
        console.log(error);
    }
}

exports.addApartment = async (buildingcode, code, capacity, vacancies ) => {
    try {
        await Building.updateOne(
            {'code': buildingcode},
            {$push: {apartments: {code, capacity, vacancies}}});            
        await Apartment.addNewApartment(code, capacity, vacancies);        
    } catch (error) {
        console.log(error);
    }
}

exports.deleteApartment = async (buildingcode, apartmentcode) => {
    try {
        await Building.updateOne({code:buildingcode}, {$pull: {apartments: {code: apartmentcode}}});
    } catch (error) {
        console.log(error);
    }
}
//update capacity of a specidfic apartment -> update vacancies
exports.updateApartment = async (code, apartmentcode, capacity) => {
    try {
        const apt = await this.getApartment(code, apartmentcode);
        const oldCap = apt.capacity;
        const complement = capacity - oldCap;
        await Building.updateOne(
            {code, 'apartments.code': apartmentcode},
            {$set: {'apartments.$.capacity': capacity}});
        //update vacancies
        await Building.updateOne(
            {code, 'apartments.code': apartmentcode},
            {$inc: {'apartments.$.vacancies': complement}});
    } catch (error) {
        console.log(error);
    }
}
//check-in
exports.addResident = async (code, apartmentcode, email ) => {
    try {
        await Building.updateOne(
            {code, 'apartments.code': apartmentcode}, 
            {$push: {'apartments.$.residents': email}});
        //updated vacancies
        await Building.updateOne(
            {code, 'apartments.code': apartmentcode}, 
            {$inc: {'apartments.$.vacancies': -1}});
    } catch (error) {
        console.log(error);
    }
}
//check out
exports.deleteResident = async (code, apartmentcode, email ) => {
    try {
        await Building.updateOne(
            {code, 'apartments.code': apartmentcode},
            {$pull: {'apartments.$.residents': email}});
            //updated vacancies
        await Building.updateOne(
            {code, 'apartments.code': apartmentcode},
             {$inc: {'apartments.$.vacancies': 1}});
    } catch (error) {
        console.log(error);
    }
}

exports.addDevice = async (buildingcode, apartmentcode, devicecode ,description ) => {
    try {
        const device = {'code': devicecode, 'description': description};
        await Building.updateOne(
            {code: buildingcode, 'apartments.code': apartmentcode},
            {$push: {'apartments.$.devices': device}});
    } catch (error) {
        console.log(error);
    }
}

exports.deleteDevice = async (buildingcode, apartmentcode, devicecode ) => {
    try {
        await Building.updateOne(
            {code: buildingcode, 'apartments.code': apartmentcode},
            {$pull: {'apartments.$.devices': {'code':devicecode}}});
    } catch (error) {
        console.log(error);
    }
}

exports.updateDevice = async (code, apartmentcode, devicecode, description ) => {
    try {
        await Building.updateOne(
            {code},
            {$set: {'apartments.$[a].devices.$[d].description': description}},
            {arrayFilters:[{'a.code': apartmentcode}, {'d.code': devicecode}]});
    } catch (error) {
        console.log(error);
    }
}

//check whether a given apartment code is existed or not
exports.isApartmentExisted = async (buildingcode, apartmentcode) => {
    try {
        const apts = await this.getAllApartments(buildingcode);
        for ( let apt of apts) {
            if(apt.code === apartmentcode) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}


//check whether a given device code is existed or not
exports.isDeviceExisted = async (buildingcode, apartmentcode, devicecode) => {
    try {
        const devices = await this.getAllDevices(buildingcode, apartmentcode);
        for ( let d of devices) {
            if(d.code === devicecode) {
                return true;
            }
        }
        return false;
    } catch (error) {
        console.log(error);
    }
}
