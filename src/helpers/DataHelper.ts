

import { Router, Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";
import PropertyDef from "../models/PropertyDef";
import { DataTypes } from "../constants/DataTypes";
import ObjectType from "../models/ObjectType";
import Options from "../models/Options";
import User from "../models/User";





class DataHelper {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.get( "/populate", this.populate );
        this.router.get( "/drop", this.drop );
        this.router.get( "/test/:userId&:propertyId", this.test );
        this.router.get( "/test/:userId", this.test2 );
    }



    public populate(req: Request, res: Response, next: NextFunction) {

        const andrei = new User({
            firstName: "Andrei",
            lastName: "Gaspar",
            profileImage: "http://userimage.png",
            email: "andrei@ventana.com",
            password: "asd123",
            language: "EN"
        }) as any;


        const ildi = new User({
            firstName: "Ildiko",
            lastName: "Ignacz",
            profileImage: "http://userimage.png",
            email: "ildi@ventana.com",
            password: "asd123",
            language: "EN"
        }) as any;



        const title = new PropertyDef({
            user: andrei._id,
            name: "Title",
            dataType: DataTypes.TEXT
        });

        const description = new PropertyDef({
            user: andrei._id,
            name: "Description",
            dataType: DataTypes.TEXT
        });


        const warehouse = new ObjectType({
            user: andrei._id,
            name: "Warehouse",
            nameProperty: title._id,
            properties: [ title._id, description._id  ]
        });


        const serialNumber = new PropertyDef({
            user: andrei._id,
            name: "Serial Number",
            dataType: DataTypes.TEXT
        });


        const firstName = new PropertyDef({
            user: andrei._id,
            name: "First Name",
            dataType: DataTypes.TEXT
        });


        const lastName = new PropertyDef({
            user: andrei._id,
            name: "Last Name",
            dataType: DataTypes.TEXT
        });


        const position = new PropertyDef({
            user: andrei._id,
            name: "Position",
            dataType: DataTypes.TEXT
        });


        const person = new ObjectType({
            user: andrei._id,
            name: "Person",
            nameProperty: firstName._id,
            properties: [ firstName._id, lastName._id, position._id ]
        });


        const equipment = new ObjectType({
            user: andrei._id,
            name: "Equipment",
            nameProperty: title._id,
            properties: [ title._id, description._id, serialNumber._id ]
        });


        const colors = new Options({
            user: andrei._id,
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
            andrei.save(),
            ildi.save(),
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



    public test(req: Request, res: Response, next: NextFunction) {

        const { userId, propertyId } = req.params;

        res.send( { userId, propertyId } );
    }


    public test2(req: Request, res: Response, next: NextFunction) {

        const { userId } = req.params;

        res.send( { userId } );
    }
}



export default new DataHelper().router;