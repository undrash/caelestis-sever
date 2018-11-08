

import { Router, Request, Response, NextFunction } from "express";
import Options from "../models/Options";





class OptionsController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }


    public routes() {
        this.router.get( '/', this.getOptions );
        this.router.get( "/:id", this.getOptionsById );
        this.router.post( '/', this.createOptions );
        this.router.delete( "/:id", this.deleteOptions );
        this.router.put( "/edit", this.editOptions );
        this.router.put( "/items/edit", this.editOptionItem );
    }



    public createOptions(req: Request, res: Response, next: NextFunction) {
        const { name, options } = req.body;
        const user = req.app.get( "user" )._id;

        const newOptions = new Options({
            user,
            name,
            options
        });

        newOptions.save()
            .then( () => res.status( 200 ).json( { success: true, options: newOptions, message: "Options successfully created." } ) )
            .catch( next );

    }



    public getOptions(req: Request, res: Response, next: NextFunction) {

        const user = req.app.get( "user" )._id;

        Options.find( { user } )
            .then( (options) => res.status( 200 ).json( { success: true, options } ) )
            .catch( next );

    }



    public getOptionsById(req: Request, res: Response, next: NextFunction) {
        const _id = req.params.id;
        const user = req.app.get( "user" )._id;

        Options.findOne( { user, _id} )
            .then( (options) => res.status( 200 ).json( { success: true, options } ) )
            .catch( next );


    }



    public deleteOptions(req: Request, res: Response, next: NextFunction) {

    }



    public editOptions(req: Request, res: Response, next: NextFunction) {

    }



    public addOptionItem(req: Request, res: Response, next: NextFunction) {

    }



    public editOptionItem(req: Request, res: Response, next: NextFunction) {

    }



    public deleteOptionItem(req: Request, res: Response, next: NextFunction) {

    }



}



export default new OptionsController().router;