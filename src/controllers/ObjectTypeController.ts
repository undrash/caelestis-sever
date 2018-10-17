

import { Router, Request, Response, NextFunction } from "express";

import ObjectType from "../models/ObjectType";
import PropertyDef from "../models/PropertyDef";





class ObjectTypeController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.get( '/', this.getObjectTypes );
        this.router.get( "/:id", this.getObjectTypeById );
        this.router.post( '/', this.createObjectType );
        this.router.delete( '/', this.deleteObjectType );
        this.router.put( '/', this.editObjectType )
    }



    public getObjectTypes(req: Request, res: Response, next: NextFunction) {

        ObjectType.find()
            .then( (objectTypes) => res.send( { success: true, objectTypes } ) )
            .catch( next );

    }



    public getObjectTypeById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        ObjectType.findById( id )
            .populate( "properties" )
            .then( (objectType) => res.send( { success: true, objectType } ) )
            .catch( next );
    }



    public createObjectType(req: Request, res: Response, next: NextFunction) {
        const { name, nameProperty, properties } = req.body;

        const propertyIds = properties.map( p => p.id );
        const requiredProperties = properties.filter( p => p.required === true ).map( p => p.id );

        const objectType = new ObjectType({
            name,
            nameProperty,
            properties: propertyIds
        });

        objectType.save()
            .then( () => {
                return PropertyDef.update( { _id: { $in: requiredProperties } }, { $addToSet: { requiredFor: objectType._id } } )
            })
            .then( () => res.send( { success: true, objectType, message: "Object type successfully created." } ) )
            .catch( next );
    }



    public deleteObjectType(req: Request, res: Response, next: NextFunction) {
        const objectTypeId: string = req.params.id;

        ObjectType.findByIdAndRemove( objectTypeId )
            .then( () => res.send( { success: true, message: "Object type successfully deleted." } ) )
            .catch( next );
    }



    public editObjectType(req: Request, res: Response, next: NextFunction) {

        const { id, name, nameProperty, properties } = req.body;

        ObjectType.findById( id )
            .populate( "properties" )
            .then( (objectType) => {

            })


    }


}



export default new ObjectTypeController().router;