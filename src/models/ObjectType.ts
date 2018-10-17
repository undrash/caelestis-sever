

import { Schema, model } from "mongoose";

import { IObjectType } from "./interfaces/IObjectType";





const ObjectTypeSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (name) => name.length > 0 && name.length <= 30,
            message: "Object type name has to to be at least one characters in length, but not longer than 30."
        }
    },


    nameProperty: {
        type: Schema.Types.ObjectId,
        ref: "PropertyDef",
        required: true
    },


    properties: [ { type: Schema.Types.ObjectId , ref: "PropertyDef", default: [] } ]


});



export default model<IObjectType>( "ObjectType", ObjectTypeSchema );