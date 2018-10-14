

import { Schema, model } from "mongoose";

import { IObject } from "./interfaces/IObject";

import PropertyValueSchema from "./PropertyValue";



const ObjectSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    type: {
        type: Schema.Types.ObjectId,
        ref: "ObjectType",
        required: true
    },

    properties: {
        type: [ PropertyValueSchema ],
        default: []
    }


});



export default model<IObject>( "Object", ObjectSchema );
