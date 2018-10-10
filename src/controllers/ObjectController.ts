

import { Router, Request, Response, NextFunction } from "express";

import Object from "../models/Object";
import { Schema } from "mongoose";
import { IPropertyValue } from "../models/interfaces/IPropertyValue";







class ObjectController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }


    public routes() {
        this.router.get( "/search", this.searchForObjectsByConditions );
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

                return object.save();

            })
            .then( (object) => res.send( { success: true, object, message: "Object successfully updated." } ) )
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
        const { type, properties } = req.body;


        const object = new Object( { type } );


        for ( let i = 0; i < properties.length; i++ ) {

            let name: string = properties[i].name;
            let dataType: number = properties[i].dataType;
            let propertyDef: Schema.Types.ObjectId = properties[i].propertyDef;
            let value: Schema.Types.Mixed = properties[i].value;


            object.properties.push(<IPropertyValue>{
                name,
                dataType,
                propertyDef,
                value
            });

        }

        object.save()
            .then( () => res.send( { success: true, object, message: ""} ) )
            .catch( next );
    }



    public deleteObject(req: Request, res: Response, next: NextFunction) {
        const objectId: string = req.params.id;

        Object.findByIdAndRemove( objectId )
            .then( () => res.send( { success: true, message: "Object successfully deleted." } ) )
            .catch( next );
    }



    public searchForObjectsByConditions(req: Request, res: Response, next: NextFunction) {
        // Condition types: Equals, Not Equals, Contains

        // Search for Object where Position ( propdef 5bbb937a235fd73ee828b96e ) equals Director

        const propertyDef1: string = "5bbb937a235fd73ee828b96e";
        const value1: any = "Director";

        const propertyDef2: string = "5bbb937a235fd73ee828b96d";
        const value2: any = "Smith";


        Object.find( { $and: [
            { "properties": { $elemMatch: { propertyDef: propertyDef1, value: value1 } } },
            { "properties": { $elemMatch: { propertyDef: propertyDef2, value: value2 } } }
            ]})
            .then( (objects) => res.send( { success: true, objects } ) )
            .catch( next );

        
    }



    private generateQueryFromSearchConditions(): any {
        let query = {};



        return query;
    }



    private validateValueForProperty(value: any, type: number): boolean {

        // Input the value for the type

        return true;
    }

}



export default new ObjectController().router;