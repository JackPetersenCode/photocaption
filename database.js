const { Pool } = require('pg');
const pool = new Pool();

pool.on('error', (err, client) => {
    console.error('unexpected error on idle client', err);
    process.exit(-1);
});

pool.on('connect', (err, client) => {
    if (err) console.error(err);
    console.log(client);
    console.log('successfully connected to postgres.');
});

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})