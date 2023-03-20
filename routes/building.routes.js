const express = require('express');
const router = express.Router();
const buildingController = require('../controllers/building.controllers');
const userModel = require('../models/user.models');


/**CRUD a user/admin*/
//user sign in with email and password
router.post('/users/signin', buildingController.userSignin);

router.use(userModel.validateToken);

//add a new user{name, email, password, phone, role}
router.post('/users', userModel.ValidateRole ,buildingController.createUser);

//get all existed users
router.get('/users', userModel.ValidateRole, buildingController.getAllUsers);

//get a specific user
router.get('/users/:email', userModel.ValidateRole, buildingController.getUser);

//update password of user
router.put('/users/:email', userModel.ValidateRole, buildingController.updateUser);

//delete a specific user
router.delete('/users/:email', userModel.ValidateRole, buildingController.deleteUser);




/**CRUD buildings*/
// add a building with {name, code, address}
router.post('/', userModel.ValidateRole, buildingController.createBuilding);

//get all existed buildings
router.get('/', userModel.ValidateRole, buildingController.getAllBuildings);

//get an existed building with the given code
router.get('/:code', userModel.ValidateRole,  buildingController.getBuilding);

//get all existed appartments
router.get('/:code/apartments', buildingController.getAllApartments);

//get an existed appartments
router.get('/:code/apartments/:apartmentcode', buildingController.getApartment);

//get all existed devices
router.get('/:code/apartments/:apartmentcode/devices', buildingController.getAllDevices);

//get an existed devices
router.get('/:code/apartments/:apartmentcode/devices/:devicecode', buildingController.getDevice);

//change the address of a given building code
router.put('/:code', userModel.ValidateRole, buildingController.updateAddressBuilding);

//delete a existed building with a given code
router.delete('/:code', userModel.ValidateRole, buildingController.deleteBuilding);

//add an apartment to the building(initialize with {code, capacity = vacancies})
router.post('/:buildingcode/apartments/', userModel.ValidateRole, buildingController.addAppartment);

//add a resident to the given building--check in(using user's email)
router.post('/:code/apartments/:apartmentcode/residents',userModel.ValidateRole, buildingController.addResident);

//add a device to the apartment of the building{body: {code, description}}
router.post('/:buildingcode/apartments/:apartmentcode/devices', userModel.ValidateRole, buildingController.addDevice);

//delete an apartment
router.delete('/:code/apartments/:apartmentcode', userModel.ValidateRole, buildingController.deleteAppartment);

//delete a resident---check out
router.delete('/:code/apartments/:apartmentcode/residents/:email', userModel.ValidateRole, buildingController.deleteResident);

//delete a device
router.delete('/:code/apartments/:apartmentcode/devices/:devicecode', userModel.ValidateRole, buildingController.deleteDevice);

//update capacity of an apartment
router.put('/:code/apartments/:apartmentcode', userModel.ValidateRole, buildingController.updateAppartment);

//update the description of a device
router.put('/:code/apartments/:apartmentcode/devices/:devicecode', userModel.ValidateRole, buildingController.updateDevice);


module.exports = router;
