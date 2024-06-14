/* eslint-disable no-undef */
db = db.getSiblingDB('Vote');
db.createUser({
  user: 'fobos',
  pwd: 'Nic14012000',
  roles: [{ role: 'dbOwner', db: 'Vote' }],});
db.createCollection('voters');
