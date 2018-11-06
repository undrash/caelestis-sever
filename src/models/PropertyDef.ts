

import { Schema, model, Model } from "mongoose";

import { IPropertyDef } from "./interfaces/IPropertyDef";
import { DataTypes } from "../constants/DataTypes";
import ObjectType from "./ObjectType";
import Object from "./Object";





const PropertyDefSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },


    name: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (name) => name.length > 0 && name.length <= 30,
            message: "Property definition name has to to be at least one characters in length, but not longer than 30."
        }
    },


    dataType: {
        type: Number,
        required: true
    },


    objectType: {
        type: Schema.Types.ObjectId,
        ref: "ObjectType"
    },


    requiredFor: [ { type: Schema.Types.ObjectId, ref: "ObjectType" } ]

});


PropertyDefSchema.pre( "save", function (next) {
    const self = this as IPropertyDef;

    if ( self.dataType !== DataTypes.LOOKUP  ) next();


    if ( ! self.objectType ) {
        next( new Error( "Property of type LOOKUP requires an object type associated" ) );
    }


    if ( ! /^[a-fA-F0-9]{24}$/.test( self.objectType.toString() ) ) {
        next( new Error( "Invalid id provided for object type, when creating a property definition." ) );
    }


    ObjectType.count( { _id: self.objectType } , function (err, count) {
        if ( err ) {

            next( err );

        } else if ( count < 1 ) {

            self.invalidate( "objectType", "Object type must exist in the system, for it to be linked to a property definition.", null );
            next( new Error( "Object type id provided does not link to an existing document in the database." ) );

        } else {
            next();
        }
    });

});



PropertyDefSchema.pre( "save", function (next) {
    const self = this as IPropertyDef;

    if ( ! self.requiredFor.length ) next();

    Object.count( { _id: { $in: self.requiredFor } }, function (err, count) {

        if ( err ) {

            next( err );

        } else if ( count !== self.requiredFor.length ) {

            self.invalidate( "requiredFor", "Object types listed as required for must contain a valid document id", count );
            next( new Error( "Object types listed as required for must contain a valid document id" ) );

        } else {
            next();
        }

    });

});



const PropertyDef: Model<IPropertyDef> = model<IPropertyDef>( "PropertyDef", PropertyDefSchema );

export default PropertyDef;