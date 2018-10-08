

import { Schema, model } from "mongoose";

import { IObject } from "./interfaces/IObject";





const ObjectSchema = new Schema({

    type: {
        type: Schema.Types.ObjectId,
        ref: "ObjectType",
        required: true
    },

    properties: {
        type: [ Schema.Types.ObjectId ],
        ref: "PropertyValue"
    }


});



export default model<IObject>( "Object", ObjectSchema );
