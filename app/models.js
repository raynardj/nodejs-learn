const {Sequelize,Model,DataTypes} = require('sequelize');

const sequelize = new Sequelize({dialect:"sqlite",storage:"app.db"},);

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

sequelize.sync();
DBs.sync();
SqlApi.sync();

// DBs.create({name:"hugedb1",conn_str:"abc/def/ghi"})
//     .then(db => {
//         SqlApi.create({
//             slug:"api1",
//             db_id:db.id,
//             sql:"select * from text",
//             is_temp:false, 
//         })
//         .then(api => {
//             console.log(api.toJSON());
//         })
//     })
module.exports = {
    DBs:DBs,
    SqlApi:SqlApi,
    sequelize:sequelize
}
