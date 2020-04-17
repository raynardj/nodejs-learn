const {Sequelize,Model,DataTypes} = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');


class User extends Model {}
User.init({
    username:DataTypes.STRING,
    birthday:DataTypes.DATE
},{sequelize, modelName:"user"});

sequelize.sync()
    .then(()=> User.create({
        username:'Lena',
        birthday: new Date(1992,1,20)
    }))
    .then(jane => {
        console.log(jane.toJSON())
    })
