const express = require('express');
const router = express.Router();
const relayController = require('../controller/relayController');

// GET sensor data for s1
router.get('/sensors', relayController.getSensorData);

// POST sensor data to s1
router.post('/sensors', relayController.postSensorData);

router.post('/relay/toggle', relayController.toggleRelay);
router.get('/relay/log', relayController.getRelayLog);

module.exports = router;
