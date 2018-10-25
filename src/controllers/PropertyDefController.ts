

import { Router, Request, Response, NextFunction } from "express";

import PropertyDef from "../models/PropertyDef";
import Object from "../models/Object";
import ObjectType from "../models/ObjectType";
import {IObjectType} from "../models/interfaces/IObjectType";




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
        this.router.put( "/edit/", this.editPropertyDefName );
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

        ObjectType.find( { nameProperty: propertyDefId } )
            .then( (objectTypes): any => {

                let otNames: string = "";

                for ( let ot of objectTypes ) {
                    otNames += ot.name + " ";
                }


                if ( objectTypes.length ) {
                    res.send( { success: false, message: "Property definition is used as the name property for " + otNames + " object types. Therefore it cannot be deleted" } );
                    return;
                } else {

                    return ObjectType.find( { properties: propertyDefId } );

                }

            })
            .then( (objectTypes): any => {

                let objectTypeIds = [];

                for ( let ot of objectTypes ) {
                    objectTypeIds.push( ot._id );

                    ot.properties.pull( propertyDefId );
                }

                return Object.find( { type: { $in: objectTypeIds } } );
            })
            .then( (objects)=> {

                return objects.map( (object) => {

                    for ( let property of object.properties ) {

                        if ( property.propertyDef.toString() === propertyDefId ) {
                            console.log( "Property found and removed on object." );
                            object.properties.pull( property._id );
                            break;
                        }

                    }

                    return object.save();
                })
            })
            .then( (promises) => {
                return Promise.all( promises );
            })
            .then( (results) => res.send( { success: true, message: "PropertyDef deletion successful, number of objects updated: " + results.length } ) )
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

        const { objectType, propertyDef, required } = req.body;

        if ( required ) {

            PropertyDef.findByIdAndUpdate( propertyDef, { $addToSet: { requiredFor: objectType } } )
                .then( () => res.send( { success: true, message: `Property def has been set required for object type  ${ objectType }` } ) )
                .catch( next );

        } else {

            PropertyDef.findByIdAndUpdate( propertyDef, { $pull: { requiredFor: objectType } } )
                .then( () => res.send( { success: true, message: `Property def has been set as ***NOT** required for object type  ${ objectType }` } ) )
                .catch( next );

        }


    }



    public editPropertyDefName(req: Request, res: Response, next: NextFunction) {
        const { id, name } = req.body;


        PropertyDef.findByIdAndUpdate( id, { name } )
            .then( () => {

                Object.find( { "properties.propertyDef": id }, { "properties.name": 1, "properties.propertyDef": 1 },  )
                    .then( (objects) => {

                        return objects.map( (object) => {

                            object.properties.forEach( (propVal) => {
                                if ( propVal.propertyDef.toString() === id ) propVal.name = name;
                            });


                            return object.save();
                        })

                    })
                    .then( (promises) => {
                        return Promise.all( promises );
                    })
                    .then( (results) => res.send( { success: true, objectsUpdated: results.length } ) )
                    .catch( next );

            });
    }

}



export default new PropertyDefController().router;