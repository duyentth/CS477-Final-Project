const bcrypt = require('bcrypt');
const buildingModel = require ('../models/building.model');
const userModel = require('../models/user.models');


//CRUD a user/admin
exports.createUser = async (req, res) => {
    const {name, email, password, phone, role} = req.body;
    if(await userModel.isExisted(email)) {
        res.status(400).send("Invalide email");
        return;
    }
    const hashedpswrd  = bcrypt.hashSync(password, 10);
    try {
        await userModel.addNewUser(name, email, hashedpswrd, phone, role );
        res.status(200).send('a new user is added');
    } catch (error) {
        res.status.send(error);
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.getAllUsers();
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getUser = async (req, res) => {
    const {email} = req.params;
    if(!(await userModel.isExisted(email))) {
        res.status(404).send("Not found any user with the given email");
        return;
    }
    try {
        const user = await userModel.getUser(email);
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};
//change user's password
exports.updateUser = async (req, res) => {//update password only
    const {email} = req.params;
    const {oldpassword, newpassword} = req.body;
    const user = await userModel.getUser(email);
    if(!user) {
        res.status(404).send("user is not found");
        return;
    }   
    const hashedpwd = user.password;
    if(!( bcrypt.compareSync(oldpassword, hashedpwd))){
        res.status(404).send('Wrong password');
        return;
    }
    const hashedNewPwd  = bcrypt.hashSync(newpassword, 8);      
    try {
        await userModel.updateUser(email, hashedNewPwd);
        res.status(200).send("user is updated");
    } catch (error) {
        res.status(400).send(error);
    }
};
exports.deleteUser = async (req, res) => {
    const {email} = req.params;
    try {
        await userModel.deleteUser(email);
        res.status(200).send("user is deleted");
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.userSignin = async (req, res) => {
    const {email,password} = req.body;
    if(!(await userModel.isExisted(email))) {
        res.status(404).send("User not found");
        return;
    }
    try {
        const token = await userModel.userSignin(email, password);
        res.status(200).send(token);
    } catch (error) {
        res.status(400).send(error);
    }
};


//middleware validateToken
exports.validateToken = async (req, res, next) => {
    if(!req.headers.authorization) {
        return res.status(401).send("Please provide the valid token");
    }
    const splits = req.headers.authorization.split(' ');
    if( splits.length != 2) {
        return next(new Error('Please use bearer schema'));
    }
    const token = splits[1];
    try {
        const user = jwt.verify(token, PRIVATEKEY);
        req.password = user.password;
        req.email = user.email;
        next();
    } catch (error) {
        res.status(403).send("Forbidden. Wrong JWT");
        return;
    }
}

/**temporaly remove
//CRUD devices
exports.createDevice = async (req, res) => {
    const {code, description} = req.body;
    if (await deviceModel.isExisted(code))  {
        res.status(400).send("This device code is existed");
        return;
    }
    try {
        await deviceModel.createDevice(code, description);
        res.status(200).send("a new device is added");
    } catch (error) {
        res.status(400).send(error);
    }
};



exports.getAllDevices = async (req, res) => {
    try {
        const devices = await deviceModel.getAllDevices();
        res.status(200).send(devices);
    } catch (error) {
        res.status(400).send(error);
    }
};
exports.getDevice = async (req, res) => {
    const {devicecode} = req.params;
    try {
        const device = await deviceModel.getDevice(devicecode);
        res.status(200).send(device);
    } catch (error) {
        res.status(400).send(error);
    }
};
exports.updateDevice = async (req, res) => {
    const {devicecode} = req.params;
    const {description} = req.body;
    try {
        await deviceModel.updateDevice(devicecode, description);
        res.status(200).send(" device is updated");
    } catch (error) {
        res.status(400).send(error);
    }
};
exports.deleteDevice = async (req, res) => {
    const {devicecode} = req.params;
    try {
        await deviceModel.deleteDevice(devicecode);
        res.status(200).send("a device is deleted");
    } catch (error) {
        res.status(400).send(error);
    }
};

//CRUD apartments

exports.createApartment = async (req, res) => {
    const {code, capacity, vacancies} = req.body;
    if(capacity != vacancies) {
        res.status(400).send('Please initialize the appartment with the same capacity and vacancies');
        return;
    }
    if( await apartmentModel.isExisted(code)) {
        res.status(400).send('This apartment code is existed');
        return ;
    }
    try {
        await apartmentModel.addNewApartment(code, capacity, vacancies);
        res.status(200).send("a new apartment is added");
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getAllapartments = async (req, res) => {
    try {
        const apartments = await apartmentModel.getAllApartments();
        res.status(200).send(apartments);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getApartment = async (req, res) => {
    const {apartmentcode} = req.params;
    try {
        const apartment = await apartmentModel.getExistedApartment(apartmentcode);
        if (!apartment) {
            res.status(404).send('NOT FOUND');
            return;
        }
        res.status(200).send(apartment);
    } catch (error) {
        res.status(400).send(error);
    }
};
exports.updateApartment = async (req, res) => {
    try {
        
        res.status(200).send("")
    } catch (error) {
        res.status(400).send(error);
    }
};
exports.checkInOutApartment = async (req, res) => {
    try {
        
        res.status(200).send("")
    } catch (error) {
        res.status(400).send(error);
    }
};
exports.deleteApartment = async (req, res) => {
    const {apartmentcode} = req.params;
    if( !(await apartmentModel.isExisted(apartmentcode))){
        res.status(404).send('Not found');
        return;
    }
    try {
        await buildingModel.deleteApartment(apartmentcode);
        res.status(200).send("")
    } catch (error) {
        res.status(400).send(error);
    }
};
 */


////CRUD buildings

// add a building with {name, code, address}
exports.createBuilding = async (req, res) => {
    const {name, code, address} = req.body;
    if( await buildingModel.isExisted(code)) {
        res.status(400).send("This given code is existed aready");
        return;
    }
    try {
        await buildingModel.addNewBuilding(name, code, address);
        res.status(200).send("a new building is added");
    } catch (error) {
        res.status(400).send(error);
    }
};

//get all existed buildings
exports.getAllBuildings = async (req, res) => {    
    try {
        const buildings = await buildingModel.getAllBuildings();
        res.status(200).send(buildings);
    } catch (error) {
        res.status(400).send(error);
    }
};

//get an existed building with the given code
exports.getBuilding = async (req, res) => {
    const {code} = req.params;
    try {
        const building = await buildingModel.getBuilding(code);
        if(!building) {
            res.status(404).send('Not found');
            return;
        }
        res.status(200).send(building);
    } catch (error) {
        res.status(400).send(error);
    }
};

//get all existed appartments
exports.getAllApartments = async (req, res) => {
    const{code} = req.params;
    if(!(await buildingModel.isExisted(code))) {
        res.status(400).send("Building is not found");
        return;
    }
    try {
        const apartments = await buildingModel.getAllApartments(code);
        res.status(200).send(apartments);
    } catch (error) {
        res.status(400).send(error);
    }
};

//get an existed apartment
exports.getApartment = async (req, res) => {
    const {code, apartmentcode} = req.params;
    if(!(await buildingModel.isExisted(code))) {
        res.status(400).send("Building is not found");
        return;
    }
    try {
        const apartment = await buildingModel.getApartment(code, apartmentcode);
        if(!apartment) {
            res.status(404).send('Not Found');
            return;
        }
        res.status(200).send(apartment);
    } catch (error) {
        res.status(400).send(error);
    }
};

//get all existed devices
exports.getAllDevices = async (req, res) => {
    const {code, apartmentcode} = req.params;
    if(!(await buildingModel.isExisted(code))) {
        res.status(404).send("Building is not found");
        return;
    };   
    if(!(await buildingModel.isApartmentExisted(apartmentcode))) {
        res.status(404).send("Apartment is not found");
        return;
    }
    try {
        const devices = await buildingModel.getAllDevices(code, apartmentcode);
        if(!devices) {
            res.status(404).send('Not Found');
            return;
        }
        res.status(200).send(devices);
    } catch (error) {
        res.status(400).send(error);
    }
};

//get an existed device
exports.getDevice = async (req, res) => {
    const {code, apartmentcode, devicecode} = req.params;
    if(!(await buildingModel.isExisted(code))) {
        res.status(400).send("Building is not found");
        return;
    }
    if(!(await buildingModel.isApartmentExisted(code, apartmentcode))) {
        res.status(400).send("Apartment is not found");
        return;
    }
    try {
        const device = await buildingModel.getDevices(code, apartmentcode,devicecode);
        if(!device) {
            res.status(404).send("Not Found");
            return;
        }
        res.status(200).send(device);
    } catch (error) {
        res.status(400).send(error);
    }
};

//change the address of a given building code
exports.updateAddressBuilding = async (req, res) => {
    const {code} = req.params;
    const {address} = req.body;
    if( !(await buildingModel.isExisted(code))) {
        res.status(404).send("Building is not found");
        return;
    }
    try {
        await buildingModel.updateExistedBuilding(code, address);
        res.status(200).send("address is updated");
    } catch (error) {
        res.status(400).send(error);
    }
};

//delete a existed building with a given code
exports.deleteBuilding = async (req, res) => {
    const {code} = req.params;
    if(!(await buildingModel.isExisted(code))) {
        res.status(404).send("Building is not found with the given code");
        return;
    }
    try {
        await buildingModel.deleteBuilding(code);
        res.status(200).send("a building is deleted");
    } catch (error) {
        res.status(400).send(error);
    }
};

//add an apartment to the building (initialize with {code, capacity = vacancies})
exports.addAppartment = async (req, res) => {
    const {buildingcode} = req.params;
    const {code, capacity, vacancies} = req.body;
    if(!(await buildingModel.isExisted(buildingcode))) {
        res.status(404).send("building is not found");
        return;
    }
    if (capacity != vacancies) {
        res.status(400).send('the capacity and vacancies should have a same value');
        return;
    }
    if(await buildingModel.isApartmentExisted(buildingcode, code)) {
        res.status(400).send("Apartment code is existed");
        return;
    }
    try {
        await buildingModel.addApartment(buildingcode, code, capacity, vacancies);
        res.status(200).send("a new apartment is added");
    } catch (error) {
        res.status(400).send(error);
    }
};

//add a resident to the given building--check in
exports.addResident = async (req, res) => {
    const {code, apartmentcode} = req.params;
    const {email} = req.body;
    if(!(await buildingModel.isExisted(code))) {
        res.status(404).send("building is not found");
        return;
    };
    if(!(await buildingModel.isApartmentExisted(code, apartmentcode))) {
        res.status(400).send("Apartment is not found");
        return;
    }
    try {
        await buildingModel.addResident(code, apartmentcode, email);
        res.status(200).send("a new resident is added");
    } catch (error) {
        res.status(400).send(error);
    }
};

//add a device to the apartment of the building
exports.addDevice = async (req, res) => {
    const {buildingcode, apartmentcode} = req.params;
    const {code, description} = req.body;
    if(!(await buildingModel.isExisted(buildingcode))) {
        res.status(404).send("building is not found");
        return;
    };
    if(!(await buildingModel.isApartmentExisted(buildingcode, apartmentcode))) {
        res.status(400).send("Apartment is not found");
        return;
    }
    try {
        await buildingModel.addDevice(buildingcode, apartmentcode, code, description);
        res.status(200).send("a new device is added");
    } catch (error) {
        res.status(400).send(error);
    }
};

//delete an apartment
exports.deleteAppartment = async (req, res) => {
    const {code, apartmentcode} = req.params;
    if(!(await buildingModel.isExisted(code))) {
        res.status(404).send("building is not found");
        return;
    };
    if(!(await buildingModel.isApartmentExisted(code, apartmentcode))) {
        res.status(404).send("Apartment is not found");
        return;
    }
    try {
        await buildingModel.deleteApartment(code, apartmentcode);
        res.status(200).send("an apartment is deleted");
    } catch (error) {
        res.status(400).send(error);
    }
};

//delete a resident---check out
exports.deleteResident = async (req, res) => {
    const {code, apartmentcode, email} = req.params;
    if(!(await buildingModel.isExisted(code))) {
        res.status(404).send("building is not found");
        return;
    };
    if(!(await buildingModel.isApartmentExisted(code, apartmentcode))) {
        res.status(404).send("Apartment is not found");
        return;
    }
    try {
        await buildingModel.deleteResident(code, apartmentcode, email);
        res.status(200).send("a resident is deleted");
    } catch (error) {
        res.status(400).send(error);
    }
};

//delete a device
exports.deleteDevice = async (req, res) => {
    const {code, apartmentcode, devicecode} = req.params;
    if(!(await buildingModel.isExisted(code))) {
        res.status(404).send("building is not found");
        return;
    };
    if(!(await buildingModel.isApartmentExisted(code, apartmentcode))) {
        res.status(404).send("Apartment is not found");
        return;
    }
    if(!(await buildingModel.isDeviceExisted(code, apartmentcode, devicecode))) {
        res.status(404).send("Device is not found");
        return;
    }
    try {
        await buildingModel.deleteDevice(code, apartmentcode, devicecode);
        res.status(200).send("a device is deleted");
    } catch (error) {
        res.status(400).send(error);
    }
};

//update capacity of an apartment
exports.updateAppartment = async (req, res) => {
    const {code, apartmentcode} = req.params;
    const {capacity} = req.body;
    if(!(await buildingModel.isExisted(code))) {
        res.status(404).send("building is not found");
        return;
    };
    if(!(await buildingModel.isApartmentExisted(code, apartmentcode))) {
        res.status(404).send("Apartment is not found");
        return;
    }
    try {
        await buildingModel.updateApartment(code, apartmentcode, capacity);
        res.status(200).send("success");
    } catch (error) {
        res.status(400).send(error);
    }
};

//update the description of a device
exports.updateDevice = async (req, res) => {
    const {code, apartmentcode, devicecode} = req.params;
    const {description} = req.body;
    if(!(await buildingModel.isExisted(code))) {
        res.status(404).send("building is not found");
        return;
    };
    if(!(await buildingModel.isApartmentExisted(code, apartmentcode))) {
        res.status(404).send("Apartment is not found");
        return;
    }
    if(!(await buildingModel.isDeviceExisted(code, apartmentcode, devicecode))) {
        res.status(404).send("Device is not found");
        return;
    }
    try {
        await buildingModel.updateDevice(code, apartmentcode, devicecode, description);
        res.status(200).send("device's description is updated");
    } catch (error) {
        res.status(400).send(error);
    }
};
