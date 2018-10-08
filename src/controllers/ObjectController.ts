

import { Router, Request, Response, NextFunction } from "express";

import Object from "../models/Object";
import {Schema} from "mongoose";
import {IPropertyValue} from "../models/interfaces/IPropertyValue";





class ObjectController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }


    public routes() {
        this.router.post( '/', this.createObject );
        this.router.delete( "/:id", this.deleteObject );
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

}



export default new ObjectController().router;