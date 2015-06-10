'use strict';

var Bookshelf = require('bookshelf');

var knex =  !process.env.DATABASE_URL ? require('./local_config.js') :
  require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL
});

var db = require('bookshelf')(knex);

db.knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('users', function (user) {
      user.increments('id').primary();
      user.string('facebookID', 50).unique();
      user.string('name', 50);
      user.string('facebookToken', 255);
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('wallPhotos').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('wallPhotos', function (wallPhoto) {
      wallPhoto.increments('id').primary();
      wallPhoto.string('photo', 255);
      wallPhoto.string('photoID', 50);
      wallPhoto.string('thumbnail', 255);

      //relations
      wallPhoto.integer('user_id').unsigned()
      .references('id')
      .inTable('users');
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('snips').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('snips', function (snip) {
      snip.increments('id').primary();
      snip.string('name', 255);
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

db.knex.schema.hasTable('snipPhotos').then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('snipPhotos', function (snipPhoto) {
      snipPhoto.increments('id').primary();
      snipPhoto.string('snipPhoto', 255);
      snipPhoto.string('snipPhotoID', 255);
      snipPhoto.string('thumbnail', 255);


      snipPhoto.integer('snip_id').unsigned()
      .references('id')
      .inTable('snips');
    }).then(function (table) {
      console.log('Created Table', table);
    });
  }
});

// This is our join table for many snips to many users
db.knex.schema.hasTable('snips_users')
.then(function(exists) {
  if (!exists) {
    db.knex.schema.createTable('snips_users', function (table) {

      //relations
      table.integer('snip_id').unsigned()
      .references('id')
      .inTable('snips');

      table.integer('user_id').unsigned()
      .references('id')
      .inTable('users');
    }).then(function (table) {
      console.log('Created join table', table);
    });
  }
});

module.exports = db;
