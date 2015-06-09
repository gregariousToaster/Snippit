var knex = require('knex')({
  client: 'pg',
  connection: {
    host     : 'ec2-54-163-238-169.compute-1.amazonaws.com',
    port: '5432',
    user     : 'qnryedrjrthefg',
    password : 'VBfJ0jQ37CfuK5CDxJlDU_mh6w',
    database : 'ddk3cu6kia5c6e',
    charset  : 'utf8',
    ssl: true
  }
});

module.exports = knex;
