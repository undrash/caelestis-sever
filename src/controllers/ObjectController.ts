

import { Router, Request, Response, NextFunction } from "express";

import Object from "../models/Object";
import { Schema } from "mongoose";
import { IPropertyValue } from "../models/interfaces/IPropertyValue";
import ObjectType from "../models/ObjectType";
import {IObjectType} from "../models/interfaces/IObjectType";
import PropertyDef from "../models/PropertyDef";
import {IPropertyDef} from "../models/interfaces/IPropertyDef";
import {ValidationHelper} from "../helpers/ValidationHelper";
import {ObjectSearchHelper} from "../helpers/ObjectSearchHelper";







class ObjectController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }


    public routes() {
        this.router.post( "/search", this.searchForObjectsByConditions );
        this.router.post( "/properties", this.setProperties );
        this.router.get( "/type/:id", this.getObjectsByType );
        this.router.delete( "/:id", this.deleteObject );
        this.router.post( '/', this.createObject );
        this.router.get( '/', this.getObjects );
    }



    public setProperties(req: Request, res: Response, next: NextFunction) {

        const { Id, Properties } = req.body;

        Object.findById( { _id: Id } )
            .then( (object) => {

                if ( ! object ) {
                    res.send( { success: false, message: "Object of id " + Id + " not found." } );
                    return;
                }

                for ( let i = 0; i < Properties.length; i++ ) {

                    for ( let j = 0; j < object.properties.length; j++ ) {

                        if ( Properties[i].Id == ( object.properties[j] as any )._id ) {

                            object.properties[j].value = Properties[i].Value;
                            break;
                        }
                    }
                }

                // TODO beforeEditObject

                return object.save();

            })
            .then( (object) => {

                // TODO afterEditObject

                res.send( { success: true, object, message: "Object successfully updated." } );
            } )
            .catch( next );
    }



    public getObjects(req: Request, res: Response, next: NextFunction) {

        Object.find()
            .then( (objects) => res.send( { success: true, objects } ) )
            .catch( next );

    }



    public getObjectsByType(req: Request, res: Response, next: NextFunction){
        const type: string = req.params.id;


        Object.find( { type })
            .then( (objects) => res.send( { success: true, objects } ) )
            .catch( next );
    }



    public createObject(req: Request, res: Response, next: NextFunction) {

        /** PROTOCOL EXAMPLE
         * {
                "type":"5bc346320faf484be056fb90",
                "properties":[
                    {
                        "propertyDef":"5bc346320faf484be056fb8d",
                        "value":"John"
                    },
                    {
                        "propertyDef":"5bc346320faf484be056fb8e",
                        "value":"Doe"
                    },
                    {
                        "propertyDef":"5bc346320faf484be056fb8f",
                        "value":"Director"
                    }
                ]
            }
         *
         * type: id of ObjectType
         * propertyDef: id of PropertyDef
         *
         * */


        const { type, properties } = req.body;

        let ot = null;
        let nameProperty = null;

        ObjectType.findById( type )
            .then( (objectType): any => {

                objectType = objectType as IObjectType;

                if ( ! objectType ) {
                    res.send( { success: false, message: "Invalid object type specified at object creation" } );
                    return;
                }

                ot = objectType;
                nameProperty = objectType.nameProperty;


                return PropertyDef.find( { _id: { $in: objectType.properties } } );
            })
            .then( (objectTypeProps) => {

                objectTypeProps = objectTypeProps as [ IPropertyDef ];

                /** Validate required properties */

                for ( let prop of objectTypeProps ) {

                    if ( prop.requiredFor.includes( type ) ) {

                        for ( let p of properties ) {

                            if ( p.propertyDef === prop._id ) {

                                if ( p.value == null || p.value == "" ) {

                                    res.send( { success: false, message: prop.name + " is a required property for objects of type " + ot.name } );
                                    return;
                                }
                            }
                        }
                    }
                }

                /** Create object */

                let object = new Object( { type, nameProperty } );
                let propertyValues = [];


                /** Populate properties */

                for ( let prop of objectTypeProps ) {

                    console.log( properties );
                    console.log( prop );
                    console.log( prop._id );


                    let propVal = properties.filter( p => p.propertyDef === prop._id.toString() )[0];

                    console.log( propVal );


                    if ( ! propVal ) propVal = { propertyDef: prop._id, value: "" };

                    /** Validate property value against the data type */

                    if ( propVal.value !== "" && propVal.value != null ) {

                        if ( ! ValidationHelper.validatePropertyValueForDataType( propVal.value, prop.dataType  ) ) {

                            res.send( { success: false, message: "Invalid value " + propVal.value + " for property " + prop.name } );
                            return;

                        }
                    }


                    propertyValues.push({
                        name: prop.name,
                        dataType: prop.dataType,
                        propertyDef: prop._id,
                        value: propVal.value
                    });
                }


                object.properties = propertyValues;


                object.save()
                    .then( () => {

                        res.send( { success: true, object, message: "" } );

                    })
                    .catch( next );


            })
            .catch( next );


    }



    public deleteObject(req: Request, res: Response, next: NextFunction) {
        const objectId: string = req.params.id;

        // TODO beforeDeleteObject

        Object.findByIdAndRemove( objectId )
            .then( () => {

                // TODO afterDeleteObject

                res.send( { success: true, message: "Object successfully deleted." } );

            })
            .catch( next );
    }



    public searchForObjectsByConditions(req: Request, res: Response, next: NextFunction) {


        Object.find( ObjectSearchHelper.generateQueryFromSearchConditions( req.body ) )
            .then( (objects) => res.send( { success: true, objects } ) )
            .catch( next );

        // Condition types: Equals, Not Equals, Contains

        // Search for Object where Position ( propdef 5bbb937a235fd73ee828b96e ) equals Director

        // const propertyDef1: string = "5bbb937a235fd73ee828b96e";
        // const value1: any = "Director";
        //
        // const propertyDef2: string = "5bbb937a235fd73ee828b96d";
        // const value2: any = "Smith";
        //
        //
        // Object.find( { $and: [
        //     { "properties": { $elemMatch: { propertyDef: propertyDef1, value: value1 } } },
        //     { "properties": { $elemMatch: { propertyDef: propertyDef2, value: value2 } } }
        //     ]})
        //     .then( (objects) => res.send( { success: true, objects } ) )
        //     .catch( next );

        
    }





    private validateValueForProperty(value: any, type: number): boolean {

        // Input the value for the type

        return true;
    }

}



export default new ObjectController().router;