

import { Schema, model, Model } from "mongoose";
import { IUser } from "./interfaces/IUser";
const bcrypt = require("bcryptjs");



const SALT_WORK_FACTOR = 10;



const UserSchema = new Schema({


    firstName: {
        type: String,
        required: true,
        validate: {
            validator: (name) => name.length > 1 && name.length <= 30,
            msg: "First name has to to be at least two characters in length, but not longer than 30."
        }
    },


    lastName: {
        type: String,
        required: true,
        validate: {
            validator: (name) => name.length > 1 && name.length <= 30,
            msg: "First name has to to be at least two characters in length, but not longer than 30."
        }
    },


    profileImage: String,


    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (email) => {
                let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailRegex.test( email );
            },
            msg: "Please provide a valid email address."
        }
    },


    password: {
        type: String,
        required: true,
        validate: {
            validator: (password) => password.length > 4 && password.length < 75,
            msg: "Password must contain 4 or more characters."
        }
    },


    language: {
        type: String,
        required: true,
        validate: {
            validator: (lang) => lang.length > 1 && lang.length < 11,
            msg: "Language string must be at least 2 characters long, but cannot exceed 10 characters."
        }
    }

});


UserSchema.pre( "save", function (next) {
    let user = (this as any);

    /** Only hash the password if it has been modified or new */

    if ( ! user.isModified("password") ) return next();

    /** Generate salt */
    bcrypt.genSalt( SALT_WORK_FACTOR, (err, salt) => {
        if ( err ) return next( err );

        /** Hash the password with the salt */
        bcrypt.hash( user.password, salt, (err, hash) => {
            if ( err ) return next( err );

            /** Override clear-text password */
            user.password = hash;
            next();
        });
    });
});


UserSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {

    let password = this.password;

    return new Promise((resolve, reject) => {

        bcrypt.compare(candidatePassword, password, (err, success) => {

            if (err) return reject(err);
            return resolve(success);

        });

    });

};


UserSchema.pre("save", function(next) {
    const self = (this as any);

    User.findOne( { email : self.email } , "email", function(err, results) {
        if( err ) {

            next( err );

        } else if( results ) {

            console.warn( "results", results );
            self.invalidate( "email", "email must be unique" );

            next( new Error( "email must be unique" ) );
        } else {
            next();
        }
    });
});



const User: Model<IUser> = model<IUser>( "User", UserSchema );


export default User;
