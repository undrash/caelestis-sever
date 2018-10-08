

import { Router, Request, Response, NextFunction } from "express";

import PropertyValue from "../models/PropertyValue";
import Object from "../models/Object";





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

        let propertyIds = [];

        const object = new Object({
            type
        });


        for ( let i = 0; i < properties.length; i++ ) {

            let name: string = properties[i].name;
            let dataType: number = properties[i].dataType;
            let propertyDef: string = properties[i].propertyDef;
            let value: any = properties[i].value;


            let p = new PropertyValue({
                name,
                dataType,
                propertyDef,
                owner: object._id,
                value
            });

            propertyIds.push( p._id );

            p.save();
        }


        object.properties = propertyIds;

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