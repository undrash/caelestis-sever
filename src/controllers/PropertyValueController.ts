

import { Router, Request, Response, NextFunction } from "express";

import PropertyValue from "../models/PropertyValue";





class PropertyValueController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.post( '/', this.setPropertyValue );
    }



    public setPropertyValue(req: Request, res: Response, next: NextFunction) {
        const { propertyId, value } = req.body;

        PropertyValue.findByIdAndUpdate( propertyId, { value } )
            .then( () => res.send( { success: true, message: "Property value successfully set." } ) )
            .catch( next );
    }

}



export default new PropertyValueController().router;