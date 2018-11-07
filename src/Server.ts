
// const dotenv = require("dotenv").config();

process.env.API_BASE ='/api/v1/';
process.env.DEFAULT_TIMEZONE ='Europe/Bucharest';

process.env.DATETIME_FORMAT ='YYYY-MM-DDTHH:mm:ssZ';
process.env.DATE_FORMAT ='YYYY-MM-DD';
process.env.TIME_FORMAT ='HH:mm:ss';

process.env.JWT_SECRET ='ogA9ppB$S!dy!hu3Rauvg!L96';
process.env.JWT_CONFIG_SESSION ='false';
process.env.JWT_CONFIG_SESSION_FAILWITHERROR ='true';

process.env.DB_IP ='127.0.0.1';



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

            if ( req.path.includes( process.env.API_BASE + "authentication/login" ) ) return next();

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
        this.app.use( "/api/v1/users/", UserController );
        this.app.use( "/api/v1/property-definitions/", PropertyDefController );
        this.app.use( "/api/v1/object-types/", ObjectTypeController );
        this.app.use( "/api/v1/options/", OptionsController );
        this.app.use( "/api/v1/objects/", ObjectController );
        this.app.use( "/api/v1/data/", DataHelper );

        this.app.use( "/api/v1/authentication/", Authentication.router );

    }

}



export default new Server().app;