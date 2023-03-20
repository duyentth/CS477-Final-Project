const express = require('express');
const router = express.Router();
const buildingController = require('../controllers/building.controllers');

/**CRUD a user/admin*/
//add a new user{name, email, password, phone, role}
router.post('/users', buildingController.createUser);

//get all existed users
router.get('/users', buildingController.getAllUsers);

//get a specific user
router.get('/users/:email', buildingController.getUser);

//update password of user
router.put('/users/:email', buildingController.updateUser);

//delete a specific user
router.delete('/users/:email', buildingController.deleteUser);

//user sign in with email and password
router.post('/users/signin', buildingController.userSignin);


/**CRUD buildings*/
// add a building with {name, code, address}
router.post('/', buildingController.createBuilding);

//get all existed buildings
router.get('/', buildingController.getAllBuildings);

//get an existed building with the given code
router.get('/:code', buildingController.getBuilding);

//get all existed appartments
router.get('/:code/apartments', buildingController.getAllApartments);

//get an existed appartments
router.get('/:code/apartments/:apartmentcode', buildingController.getApartment);

//get all existed devices
router.get('/:code/apartments/:apartmentcode/devices', buildingController.getAllDevices);

//get an existed devices
router.get('/:code/apartments/:apartmentcode/devices/:devicecode', buildingController.getDevice);

//change the address of a given building code
router.put('/:code', buildingController.updateAddressBuilding);

//delete a existed building with a given code
router.delete('/:code', buildingController.deleteBuilding);

//add an apartment to the building(initialize with {code, capacity = vacancies})
router.post('/:buildingcode/apartments/', buildingController.addAppartment);

//add a resident to the given building--check in(using user's email)
router.post('/:code/apartments/:apartmentcode/residents', buildingController.addResident);

//add a device to the apartment of the building{body: {code, description}}
router.post('/:buildingcode/apartments/:apartmentcode/devices', buildingController.addDevice);

//delete an apartment
router.delete('/:code/apartments/:apartmentcode', buildingController.deleteAppartment);

//delete a resident---check out
router.delete('/:code/apartments/:apartmentcode/residents/:email', buildingController.deleteResident);

//delete a device
router.delete('/:code/apartments/:apartmentcode/devices/:devicecode', buildingController.deleteDevice);

//update capacity of an apartment
router.put('/:code/apartments/:apartmentcode', buildingController.updateAppartment);

//update the description of a device
router.put('/:code/apartments/:apartmentcode/devices/:devicecode', buildingController.updateDevice);


module.exports = router;
