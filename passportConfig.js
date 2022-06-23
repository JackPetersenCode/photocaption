const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { user } = require('pg/lib/defaults');
const { sequelize, Photos, Caption, User } = require('../models');


function initialize(passport) {
    const authenticateUser = async(email, password, done) => {
        const user = await User.findOne({
            where: {email: email}
        })
        if (user) {
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    throw err;
                }
                if(isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "invalid input" })
                }
            })
        } else {
            return done(null, false, {message: "email is not registered"})
        }
    }
    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password"
            },
            authenticateUser
        )
    );

    passport.serializeUser((user, done) => done(null, user.id));

    passport.deserializeUser = async(id, done) => {
        console.log(id);  
        const user = await User.findOne({
            where: { id: id }
        })
        if (!user) {
            throw error;
        }
        console.log(user);
        return done(null, user);
    }
}

module.exports = initialize;