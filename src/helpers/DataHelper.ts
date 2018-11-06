

import { Router, Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";
import PropertyDef from "../models/PropertyDef";
import { DataTypes } from "../constants/DataTypes";
import ObjectType from "../models/ObjectType";
import Option from "../models/Option";
import Options from "../models/Options";





class DataHelper {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.get( "/populate", this.populate );
        this.router.get( "/drop", this.drop );
    }



    public populate(req: Request, res: Response, next: NextFunction) {
        const title = new PropertyDef({
            name: "Title",
            dataType: DataTypes.TEXT
        });

        const description = new PropertyDef({
            name: "Description",
            dataType: DataTypes.TEXT
        });


        const warehouse = new ObjectType({
            name: "Warehouse",
            nameProperty: title._id,
            properties: [ title._id, description._id  ]
        });


        const serialNumber = new PropertyDef({
            name: "Serial Number",
            dataType: DataTypes.TEXT
        });


        const firstName = new PropertyDef({
            name: "First Name",
            dataType: DataTypes.TEXT
        });


        const lastName = new PropertyDef({
            name: "Last Name",
            dataType: DataTypes.TEXT
        });


        const position = new PropertyDef({
            name: "Position",
            dataType: DataTypes.TEXT
        });


        const person = new ObjectType({
            name: "Person",
            nameProperty: firstName._id,
            properties: [ firstName._id, lastName._id, position._id ]
        });


        const equipment = new ObjectType({
            name: "Equipment",
            nameProperty: title._id,
            properties: [ title._id, description._id, serialNumber._id ]
        });




        /** TESTING OPTION CREATION */



        const colors = new Options({
            name: "Colors",
            options: [
                {
                    name: "Red",
                    image: "http://image-red.net"
                },
                {
                    name: "Green",
                    image: "http://image-green.net"
                },
                {
                    name: "Blue",
                    image: "http://image-blue.net"
                }
            ]
        });



        Promise.all([
            title.save(),
            description.save(),
            warehouse.save(),
            serialNumber.save(),
            equipment.save(),
            firstName.save(),
            lastName.save(),
            position.save(),
            person.save(),
            colors.save()
        ])
            .then( () => res.send( "Database successfully populated." ) )
            .catch( next );



    }



    public drop(req: Request, res: Response, next: NextFunction) {

        console.log( mongoose.connection.collections );
    }
}



export default new DataHelper().router;