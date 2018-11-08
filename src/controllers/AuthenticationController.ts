
import { Router, Request, Response, NextFunction } from "express";

import * as jwt from "jwt-simple";
import * as passport from "passport";
import * as moment from "moment";
import { Strategy, ExtractJwt } from "passport-jwt";
import { IUser } from "../models/interfaces/IUser";
import User from "../models/User";



class AuthenticationController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.post( "/login", this.login );
        this.router.post( "/sign-up", this.signUp );
    }



    public initialize() {
        passport.use("jwt", this.getStrategy() );
        return passport.initialize();
    }



    public authenticate = (callback) => passport.authenticate("jwt", { session: false, failWithError: true }, callback);



    private login = async (req: Request, res: Response) => {

        try {
            let user = await User.findOne({ "email": req.body.email } ).exec();

            console.log( user );

            if ( user === null ) throw "User not found";

            let success = await user.comparePassword( req.body.password );

            console.log( "success: " + success );

            if ( success === false ) throw "";

            res.status( 200 ).json( { success: true, tokenData: this.genToken( user ) } );

        } catch (err) {
            res.status( 401 ).json( { success: false, message: "Invalid credentials", errors: err } );
        }
    };



    private signUp = async (req: Request, res: Response, next: NextFunction) => {

        const { firstName, lastName, email, password, language } = req.body;

        if ( ! firstName || ! lastName || ! email || ! password || ! language ) {
            res.status( 400 ).json( { success: false, message: "Missing parameters at sign up." } );
            return;
        }

        const user = new User({
            firstName,
            lastName,
            email,
            password,
            language
        });

        user.save()
            .then( () => res.status( 200 ).json( { success: true, tokenData: this.genToken( user ) } ) )
            .catch( next );

    };


    private genToken(user: IUser): Object {

        let expires = moment().utc().add({ days: 7 }).unix();

        let token = jwt.encode({
            exp: expires,
            email: user.email
        }, process.env.JWT_SECRET );

        return {
            token: "JWT " + token,
            expires: moment.unix(expires).format(),
            user: user._id
        };


    }



    private getStrategy(): Strategy {

        const params = {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
            passReqToCallback: true
        };

        return new Strategy(params, (req, payload: any, done) => {
            User.findOne({ "email": payload.email }, (err, user) => {
                /* istanbul ignore next: passport response */
                if (err) {
                    return done(err);
                }
                /* istanbul ignore next: passport response */
                if (user === null) {
                    return done( null, false, { message: "The user in the token was not found" } );
                }

                return done(null, { _id: user._id, email: user.email });
            });
        });

    }

}


export default new AuthenticationController();