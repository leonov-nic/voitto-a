db = db.getSiblingDB('Voitto');
db.createUser({
  user: 'liza',
  pwd: 'Liza1609',
  roles: [{ role: 'dbOwner', db: 'Voitto' }],});

