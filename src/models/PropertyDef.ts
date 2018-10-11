

import {Schema, model, Types, Model} from "mongoose";

import { IPropertyDef } from "./interfaces/IPropertyDef";
import ObjectType from "./ObjectType";





const PropertyDefSchema = new Schema({

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

    requiredFor: {
        type: [ Schema.Types.ObjectId ],
        ref: "ObjectType"
    }

});


PropertyDefSchema.pre( "save", function (next) {
   const self = this as IPropertyDef;

    if ( ! /^[a-fA-F0-9]{24}$/.test( self.objectType ) ) {
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



const PropertyDef: Model<IPropertyDef> = model<IPropertyDef>( "PropertyDef", PropertyDefSchema );

export default PropertyDef;