

import { Router, Request, Response, NextFunction } from "express";

import PropertyDef from "../models/PropertyDef";





class PropertyDefController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.get( '/', this.getPropertyDefs );
        this.router.get( "/:id", this.getPropertyDefById );
        this.router.post( '/', this.createPropertyDef );
        this.router.delete( "/:id", this.deletePropertyDef );
        this.router.put( "/required/", this.setPropertyDefRequired );
    }



    public createPropertyDef(req: Request, res: Response, next: NextFunction) {
        const { name, dataType, objectType, requiredFor } = req.body;

        const propertyDef = new PropertyDef({
            name,
            dataType,
            objectType,
            requiredFor
        });

        propertyDef.save()
            .then( () => res.send( { success: true, propertyDef, message: "PropertyDef successfully created." } ) )
            .catch( next );
    }



    public deletePropertyDef(req: Request, res: Response, next: NextFunction) {
        const propertyDefId: string = req.params.id;

        PropertyDef.findByIdAndRemove( propertyDefId )
            .then( () => res.send( { success: true, message: "Property definition successfully deleted." } ) )
            .catch( next );
    }



    public getPropertyDefs(req: Request, res: Response, next: NextFunction) {

        PropertyDef.find({})
            .then( (propertyDefs) => res.send( { success: true, properties: propertyDefs } ) )
            .catch( next );

    }



    public getPropertyDefById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        PropertyDef.findById( id )
            .then( (propertyDef) => res.send( { success: true, propertyDef } ) )
            .catch( next );
    }



    public setPropertyDefRequired(req: Request, res: Response, next: NextFunction) {

        const { objectType, propertyDef } = req.body;

        PropertyDef.findByIdAndUpdate( propertyDef, { $push: { requiredFor: objectType } } )
            .then( () => res.send( { success: true, message: `Property def has been set required for object type  ${ objectType }` } ) )
            .catch( next );


    }

}



export default new PropertyDefController().router;