module.exports = {
  database: 'books_adda',
  username: 'Rahiman',
  password: 'Rahiman@13',
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
