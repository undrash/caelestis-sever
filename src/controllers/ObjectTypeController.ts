

import { Router, Request, Response, NextFunction } from "express";

import ObjectType from "../models/ObjectType";





class ObjectTypeController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.post( '/', this.createObjectType );
        this.router.delete( '/', this.deleteObjectType );
        this.router.put( "/propdefs/add", this.addPropertyDef );
        this.router.put( "/propdefs/remove", this.removePropertyDef );
    }



    public createObjectType(req: Request, res: Response, next: NextFunction) {
        const { name, propertyDefs } = req.body;

        const objectType = new ObjectType({
            name,
            propertyDefs
        });

        objectType.save()
            .then( () => res.send( { success: true, objectType, message: "Object type successfully created." } ) )
            .catch( next );
    }



    public deleteObjectType(req: Request, res: Response, next: NextFunction) {
        const objectTypeId: string = req.params.id;

        ObjectType.findByIdAndRemove( objectTypeId )
            .then( () => res.send( { success: true, message: "Object type successfully deleted." } ) )
            .catch( next );
    }



    public addPropertyDef(req: Request, res: Response, next: NextFunction) {
        const { objectId, propertyId } = req.body;

        ObjectType.findByIdAndUpdate( objectId, { $addToSet: { properties: [ propertyId ] } } )
            .then( () => res.send( { success: true, message: "Property definition successfully added to object." } ) )
            .catch( next );
    }



    public removePropertyDef(req: Request, res: Response, next: NextFunction) {
        const { objectId, propertyId } = req.body;

        ObjectType.findByIdAndUpdate( objectId, { $pull: { properties: [ propertyId ] } } )
            .then( () => res.send( { success: true, message: "Property definition successfully removed from object." } ) )
            .catch( next );
    }

}



export default new ObjectTypeController().router;