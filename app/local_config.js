var knex = require('knex')({
  client: 'pg',
  connection: {
    host     : 'ec2-54-83-46-91.compute-1.amazonaws.com',
    port: '5432',
    user     : 'mqifggbxvhkhgy',
    password : 'saWADVVqRtYBHHmX6y4g98ge5K',
    database : 'dcrq0g1tamt2uc',
    charset  : 'utf8',
    ssl: true
  }
});

module.exports = knex;
