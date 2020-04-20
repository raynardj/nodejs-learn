const {Sequelize,Model,DataTypes} = require('sequelize');

const sequelize = new Sequelize('sqlite::memory:');

class DBs extends Model{}
DBs.init({
    id:{type:DataTypes.INTEGER, autoIncrement:true,primaryKey:true},
    name:{type:DataTypes.STRING},
    conn_str:{type:DataTypes.TEXT},
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

DBs.create({name:"hugedb1",conn_str:"abc/def/ghi"})
    .then(db => {
        SqlApi.create({
            slug:"api1",
            db_id:db.id,
            sql:"select * from text",
            is_temp:false, 
        })
        .then(api => {
            console.log(api.toJSON());
        })
    })
module.exports = {
    DBs:DBs,
    SqlApi:SqlApi,
    sequelize:sequelize
}
