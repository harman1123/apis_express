import express from 'express';
const Route = express.Router();
const admin = require('./admin');
const user = require('./user');
// const subscription = require('./subscription');
// const features = require('./feature');
// const featureTypes = require('./feature-type');
// const client = require('./client');

for (const property in admin) {
  Route.use('/admin', admin[property]);
}
for (const property in user) {
  Route.use('/user', user[property]);
}

// for (const property in client) {
//   Route.use('/client', client[property]);
// }


// for (const property in subscription) {
//   Route.use('/subscription-plan', subscription[property]);
// }

// for (const property in features) {
//   Route.use('/feature', features[property]);
// } 


// for (const property in featureTypes) {
//   Route.use('/feature-type', featureTypes[property]);
// } 
export default Route;