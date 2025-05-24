const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // set to true if using valid CA certs (optional in dev)
      },
    },
  }
);

const connectToDB=async function(sequalize){
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection has been established successfully.');

        await sequelize.sync({alter:true});
        console.log('✅ All models were synchronized successfully.');

    } catch (error) {
        console.error('❌ Unable to start the server due to DB error:', error);
    }
}

module.exports = {sequelize,connectToDB};