const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const db = require('../db');

function findById(id) {
    return new Promise(function (resolve, reject) {
        db.get().query('select * from user where id = ?', id, function (err, rows) {
            if (err) return reject(err);
            resolve(rows[0]);
        });
    });
}

function findByEmail(email) {
    return new Promise(function (resolve, reject) {
        db.get().query('select * from user where email = ?', email, function (err, rows) {
            if (err) return reject(err);
            resolve(rows[0]);
        });
    });
}

function insert(user, done) {
    console.log("salt & hash password");
    bcrypt.genSalt(10, (err, salt) => {
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            let values = [user.email, user.password];
            db.get().query("insert into user (email, password) values (?)", [values], function (err, result) {
                if (err) return done(err);
                done(null, {
                    id: result.insertId,
                    email: user.email,
                    password: user.password
                });
            });
        });
    });
}

function create(user) {
    return new Promise(function (resolve, reject) {
        insert(user, function (err, data) {
            if (err !== null) return reject(err);
            resolve(data);
        });
    });
}

// The user's password is never saved in plain text.  Prior to saving the
// user model, we 'salt' and 'hash' the users password.  This is a one way
// procedure that modifies the password - the plain text password cannot be
// derived from the salted + hashed version. See 'comparePassword' to understand
// how this is used.

//Fix queries
function update(user) {
    let sql = "select * from user where id = " + user.id;
    let existing = db.get().query(sql, function (err, result) {
        if (err) throw err;
        //check if password has changed - salt and hash if it did
        if (result) {
            if (result.password != user.password) {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) { return next(err); }
                    bcrypt.hash(user.password, salt, null, (err, hash) => {
                        if (err) { return next(err); }
                        user.password = hash;
                    });
                });
            }
            let updateSql = "update user set email = '" + user.email + "', password = '" + user.password + "' where id = " + user.id;
            db.get().query(sql, function (err, result) {
                if (err) throw err;
                if (result) {
                    console.log(result.affectedRows + " user record(s) updated");
                }
            });
        }
    });
}

// We need to compare the plain text password (submitted whenever logging in)
// with the salted + hashed version that is sitting in the database.
// 'bcrypt.compare' takes the plain text password and hashes it, then compares
// that hashed password to the one stored in the DB.  Remember that hashing is
// a one way process - the passwords are never compared in plain text form.
function comparePassword(currentPassword, candidatePassword, cb) {
    bcrypt.compare(candidatePassword, currentPassword, (err, isMatch) => {
        cb(err, isMatch);
    });
};

module.exports = { create, update, comparePassword, findByEmail, findById };
