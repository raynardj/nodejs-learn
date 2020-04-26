const {Sequelize,Model,DataTypes} = require('sequelize');

const sequelize = new Sequelize({dialect:"sqlite",storage:"app.db"},);
const bcrypt = require('bcrypt');
// Data base links
class DBs extends Model{
    static add_db(obj){
        console.log(`add database info ${obj}`)
        DBs.create(obj)
    }
}
DBs.init({
    id:{type:DataTypes.INTEGER, autoIncrement:true,primaryKey:true},
    name:{type:DataTypes.STRING},
    database:{type:DataTypes.STRING,allowNull:true},
    username:{type:DataTypes.STRING,allowNull:true},
    password:{type:DataTypes.STRING,allowNull:true},
    dialect:{type:DataTypes.STRING,allowNull:true},
    host:{type:DataTypes.STRING,allowNull:true},
    port:{type:DataTypes.INTEGER,allowNull:true},
    md_doc:{type:DataTypes.TEXT, allowNull:true}
}, {sequelize, modelName:"dbs"})

// SQL api
class SqlApi extends Model {}
SqlApi.init({
    slug:{type:DataTypes.STRING,unique:"compositeIndex",primaryKey:true},
    db_id:{
        type:DataTypes.INTEGER,
        references:{
            model:DBs,
            key:DBs.id,
        }
    },
    sql:{type:DataTypes.TEXT},
    is_temp:{type:DataTypes.BOOLEAN},
    md_doc:{type:DataTypes.TEXT,allowNull:true}
},{sequelize,modelName:"sqlapi"})

// Static directory root locations
class StaticLocation extends Model{}
StaticLocation.init({
    slug:{type:DataTypes.STRING,unique:"compositeIndex",primaryKey:true},
    root_path:{type:DataTypes.TEXT, allowNull:false},
    md_doc:{type:DataTypes.TEXT,allowNull:true}
}, {sequelize, modelName:"static_location"})

class User extends Model{
    static hash_str = (s)=>{
        var hashed
        bcrypt.hash(s,10,(err,hash)=>{
            console.log(hash);
            if(err)console.log(`hash failed:${err}`)
            else if(hash) hashed = hash;
        })
        console.log(hashed)
        return hashed
    }
}
User.init({
    id:{type:DataTypes.INTEGER, autoIncrement:true,primaryKey:true},
    username:{type:DataTypes.TEXT, allowNull:false},
    password:{type:DataTypes.TEXT,allowNull:false}
},{sequelize, modelName:"user"})

User.hash_str("hello my friend")
sequelize.sync();
DBs.sync();
SqlApi.sync();
StaticLocation.sync();

module.exports = {
    DBs:DBs,
    SqlApi:SqlApi,
    StaticLocation:StaticLocation,
    sequelize:sequelize
}
