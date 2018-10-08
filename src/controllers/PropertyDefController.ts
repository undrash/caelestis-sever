

import { Router, Request, Response, NextFunction } from "express";

import PropertyDef from "../models/PropertyDef";





class PropertyDefController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.post( "/create", this.createPropertyDef );
        this.router.delete( "/delete", this.deletePropertyDef );
    }



    public createPropertyDef(req: Request, res: Response, next: NextFunction) {
        const { name, dataType, requiredFor } = req.body;

        const propertyDef = new PropertyDef({
            name,
            dataType,
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

}



export default new PropertyDefController().router;