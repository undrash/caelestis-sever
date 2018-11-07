

import { Router, Request, Response, NextFunction } from "express";

import { IUser } from "../models/interfaces/IUser";
import User from "../models/User";





class UserController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.post( "/sign-up", this.signUp );
    }



    public signUp(req: Request, res: Response, next: NextFunction) {
        console.info( "SignUp request received" );

        const { firstName, lastName, email, password, language } = req.body;

        const user = new User( {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            language: language
        });

        user.save()
            .then( () => res.status( 200 ).json( { success: true, userId: user._id, message: "User successfully created for " + req.body.email } ) )
            .catch( next );
    }



}



export default new UserController().router;