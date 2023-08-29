import express from 'express';
const Route = express.Router();
const admin = require('./admin');
const user = require('./user');

for (const property in admin) {
  Route.use('/admin', admin[property]);
}
for (const property in user) {
  Route.use('/user', user[property]);
}


export default Route;