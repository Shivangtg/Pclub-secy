const { DataTypes } = require('sequelize');
const {sequelize} = require('../database/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // Or UUIDV1
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
   password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  team_name:{
    type: DataTypes.STRING
  },
  image_url:{
    type: DataTypes.TEXT,
    defaultValue:"https://www.svgrepo.com/show/521031/users-2.svg"
  }
},{
  timestamps: true // This enables createdAt and updatedAt
});

const Team=sequelize.define("Team",{
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // Or UUIDV1
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue:0,
  },
  image_url:{
    type: DataTypes.TEXT,
    defaultValue:"https://www.svgrepo.com/show/521031/users-2.svg"
  }
},{
  timestamps: true // This enables createdAt and updatedAt
})

module.exports = {User,Team};
