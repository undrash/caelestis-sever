
require( "dotenv" ).config();


import * as compression from "compression";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as express from "express";
import * as logger from "morgan";
import * as helmet from "helmet";
import * as cors from "cors";

import PropertyDefController from "./controllers/PropertyDefController";
import ObjectTypeController from "./controllers/ObjectTypeController";
import Authentication from "./controllers/AuthenticationController";
import OptionsController from "./controllers/OptionsController";
import ObjectController from "./controllers/ObjectController";
import UserController from "./controllers/UserController";
import DataHelper from "./helpers/DataHelper";





class Server {

    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }



    public config() {

        const MONGO_URI = "mongodb://localhost/caelestis";

        mongoose.connect( MONGO_URI || process.env.MONGODB_URI );


        this.app.use( bodyParser.urlencoded( { extended: true } ) );
        this.app.use( bodyParser.json() );
        this.app.use( logger( "dev" ) );
        this.app.use( compression() );
        this.app.use( helmet() );
        this.app.use( cors() );

        this.app.use( (err, req, res, next) => {
            res.status( 422 ).send( { error: err.message } );
        });

        this.app.use( Authentication.initialize() );

        this.app.all( process.env.API_BASE + "*", (req, res, next) => {

            //TODO: Remove @ release
            if ( req.path.includes( process.env.API_BASE + "data/populate" ) ) return next();


            if ( req.path.includes( process.env.API_BASE + "authentication/login" ) ) return next();
            if ( req.path.includes( process.env.API_BASE + "authentication/sign-up" ) ) return next();

            return Authentication.authenticate( (err, user, info) => {

                if ( err ) { return next( err ); }

                if ( ! user ) {
                    if ( info.name === "TokenExpiredError" ) {
                        return res.status( 401 ).json( { message: "Your token has expired. Please generate a new one!" } );
                    } else {
                        return res.status( 401 ).json( { message: info.message } );
                    }
                }

                this.app.set( "user", user );

                return next();

            })(req, res, next);
        });

    }



    public routes() {
        let router: express.Router;
        router = express.Router();

        this.app.use( '/', router );

        this.app.use( process.env.API_BASE + "authentication/", Authentication.router );

        this.app.use( process.env.API_BASE + "users/", UserController );
        this.app.use( process.env.API_BASE + "property-definitions/", PropertyDefController );
        this.app.use( process.env.API_BASE + "object-types/", ObjectTypeController );
        this.app.use( process.env.API_BASE + "options/", OptionsController );
        this.app.use( process.env.API_BASE + "objects/", ObjectController );
        this.app.use( process.env.API_BASE + "data/", DataHelper );

    }

}



export default new Server().app;