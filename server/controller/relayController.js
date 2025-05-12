//const Relay = require('../model/relay.model');
//const Temp = require('../model/temp.model')
const TempData = require('../model/temp.model');
const RelayLog = require('../model/relay.model');


// exports.getSensorData = (req, res) => {
//   const dummyData = {
//     id: Math.random() > 0.5 ? 1 : 2,
//     temp: (20 + Math.random() * 15).toFixed(1),
//     soil: Math.floor(Math.random() * 100),
//   };

//   const newEntry = new TempData(dummyData);
//   newEntry.save()
//     .then(() => TempData.find().sort({ timestamp: -1 }).limit(50))
//     .then(data => res.json(data))
//     .catch(err => res.status(500).json({ success: false, error: err.message }));
// };

exports.getSensorData = (req, res) => {
  TempData.find().sort({ timestamp: -1 }).limit(50)
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ success: false, error: err.message }));
};

exports.postSensorData = (req, res) => {
  const { id, temp, soil, timestamp } = req.body;

  if (!id || !temp || !soil || !timestamp) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const newEntry = new TempData({ id, temp, soil, timestamp });
  newEntry.save()
    .then(() => res.json({ success: true, message: 'Sensor data saved' }))
    .catch(err => res.status(500).json({ success: false, error: err.message }));
};

exports.toggleRelay = (req, res) => {
  const { state } = req.body;

  if (state === undefined) {
    return res.status(400).json({ success: false, error: 'state is required' });
  }
  
  // Since there's only one relay, ignore relayId or ensure it's always 1
  const logEntry = new RelayLog({ state });
  logEntry.save()
    .then(() => res.json({ success: true, state }))
    .catch(err => res.status(500).json({ success: false, error: err.message }));

  console.log(`Command sent: R1:${state}`);
};
exports.toggleRelay = async (req, res) => {
  try {
    const { relayId, state } = req.body;
    // Simulate or update relay state (e.g., in a real system, this might interact with hardware)
    const newState = state; // Use the state sent by the frontend

    // Log the toggle event
    const logEntry = new RelayLog({
      relayId,
      state: newState,
      timestamp: new Date(),
    });
    await logEntry.save()
    .then(() => res.json({ success: true, state }))
    .catch(err => res.status(500).json({ success: false, error: err.message }));

    console.log(`Command sent: R1:${state}`);
    res.status(200).json({ state: newState }); // Return the updated state
  } catch (error) {
    console.error('Error toggling relay:', error);
    res.status(500).json({ message: 'Failed to toggle relay' });
  }
};
exports.getRelayLog = (req, res) => {
  RelayLog.find().sort({ timestamp: -1 }).limit(10)
    .then(logs => res.json(logs))
    .catch(err => res.status(500).json({ success: false, error: err.message }));
};