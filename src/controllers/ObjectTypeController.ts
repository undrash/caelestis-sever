

import { Router, Request, Response, NextFunction } from "express";

import ObjectType from "../models/ObjectType";
import Object from "../models/Object";
import PropertyDef from "../models/PropertyDef";
import {ValidationHelper} from "../helpers/ValidationHelper";





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
            .populate( "properties" )
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
        requiredProperties.push( nameProperty );

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
        /**
         * PROTOCOL EXAMPLE
         * {
                "id": "5bc8542dc4d555461c9c53cb",
                "name": "OBJECT TYPE NAME",
                "nameProperty": "5bc85007c4d555461c9c53bf",
                "properties": [
                  {
                      "id": "5bc85007c4d555461c9c53bf",
                      "required": true
                  },
                  {
                      "id": "5bc85408c4d555461c9c53c9",
                      "required": true
                  },
                  {
                      "id": "5bc85007c4d555461c9c53c0",
                      "required": true
                  }
              ]

            }
         *
         * id                   - document id of the Object Type
         * nameProperty         - which property from the collection will act as a name
         * properties.id        - document id of the PropertyDef
         * properties.required  - is it required for this object type
         *
         * */


        const { id, name, nameProperty, properties } = req.body;

        const newProperties = properties.map( p => p.id );


        if ( ValidationHelper.arrayHasDuplicates( newProperties ) ) {
            res.send( { success: false, message: "Duplicate values found in property array provided." } );
            return;
        }

        if ( newProperties.indexOf( nameProperty ) < 0 ) {
            res.send( { success: false, message: "Name property specified is not listed in the properties collection." } );
            return;
        }



        let oldProperties = []; // Initial properties of the Object Type before edit
        let removedProperties = []; // Items from the old properties, which are missing from the new set of properties
        let addedProperties = []; // Items from the new properties, which are missing from the old set of properties
        let requiredProperties = []; // Items that are marked as required in the new set of properties ***PLUS*** the property marked as name
        let notRequiredProperties = []; // Items that are marked as not required in the new set, and also properties that have been removed

        ObjectType.findById( id )
            .populate( "properties" )
            .then( (objectType) => {

                if ( ! objectType ) {
                    res.send( { success: false, message: "Object type of id " + id + " was not found." } );
                    return;
                }

                oldProperties               = objectType.properties.map( p => (p as any)._id.toString() );

                removedProperties           = oldProperties.filter( p => newProperties.indexOf( p ) === -1 );

                addedProperties             = newProperties.filter( p => oldProperties.indexOf( p ) === -1 );

                requiredProperties          = properties.filter( p => (p as any).required && (p as any).id !== nameProperty ).map( p => p.id );
                requiredProperties.push( nameProperty );


                notRequiredProperties   = properties.filter( p => ! (p as any).required ).map( p => p.id );

                for ( let p of removedProperties ) {
                    if ( notRequiredProperties.indexOf( p ) === -1 ) notRequiredProperties.push( p );
                }

                PropertyDef.update({ _id: { $in: notRequiredProperties } }, { $pull: { requiredFor: id } }, { multi: true } );


                if ( name ) objectType.name = name;
                objectType.nameProperty     = nameProperty;
                objectType.properties       = newProperties;

                return Promise.all([
                    objectType.save(),
                    PropertyDef.update({ _id: { $in: notRequiredProperties } }, { $pull: { requiredFor: id } }, { multi: true } ),
                    PropertyDef.update({ _id: { $in: requiredProperties } }, { $addToSet: { requiredFor: id } }, { multi: true } )
                ])
            })
            .then( () => {
                return Promise.all([
                    Object.find( { type: id } ) as any,
                    PropertyDef.find( { _id: { $in: addedProperties } } )
                ])
            })
            .then( (results) => {

                const objects       = results[0];
                const propertyDefs  = results[1];


                return objects.map( (object) => {

                    for ( let property of object.properties ) {

                        if ( removedProperties.indexOf( property.propertyDef.toString() ) > -1 ) {
                            object.properties.pull( property._id );
                        }
                    }

                    for ( let addProp of propertyDefs ) {
                        object.properties.push({
                            name: addProp.name,
                            dataType: addProp.dataType,
                            propertyDef: addProp._id
                        })
                    }

                    return object.save();

                })
            })
            .then( (promises) => {
                return Promise.all( promises );
            })
            .then( (results) => res.send( { success: true, objectsUpdated: results.length } ) )
            .catch( next );
    }
    
}



export default new ObjectTypeController().router;