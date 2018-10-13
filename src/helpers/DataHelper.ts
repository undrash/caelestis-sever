

import { Router, Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";
import PropertyDef from "../models/PropertyDef";
import {DataTypes} from "../constants/DataTypes";
import ObjectType from "../models/ObjectType";





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
            properties: [ title._id, description._id  ]
        });


        const serialNumber = new PropertyDef({
            name: "Serial Number",
            dataType: DataTypes.TEXT
        });


        const responsiblePerson = new PropertyDef({
            name: "Responpible Person",
            dataType: DataTypes.LOOKUP
        });


        const equipment = new ObjectType({
            name: "Equipment",
            properties: [ title._id, description._id, serialNumber._id, responsiblePerson._id ]
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
            properties: [ firstName._id, lastName._id, position._id ]
        });


        Promise.all([
            title.save(),
            description.save(),
            warehouse.save(),
            serialNumber.save(),
            responsiblePerson.save(),
            equipment.save(),
            firstName.save(),
            lastName.save(),
            position.save(),
            person.save()
        ])
            .then( () => res.send( "Database successfully populated." ) )
            .catch( next );



    }



    public drop(req: Request, res: Response, next: NextFunction) {

        console.log( mongoose.connection.collections );
    }
}



export default new DataHelper().router;