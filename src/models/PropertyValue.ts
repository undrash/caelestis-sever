

import { Schema, model } from "mongoose";

import { IPropertyValue } from "./interfaces/IPropertyValue";





const PropertyValueSchema = new Schema({

   name: {
       type: String,
       required: true,
       validate: {
           validator: (name) => name.length > 0 && name.length <= 30,
           message: "Property value name has to to be at least one characters in length, but not longer than 30."
       }
   },

    dataType: {
        type: Number,
        required: true
    },


    propertyDef: {
       type: Schema.Types.ObjectId,
        ref: "PropertyDef",
        required: true
    },


    owner: {
        type: Schema.Types.ObjectId,
        ref: "Object",
        required: true
    },


    value: Schema.Types.Mixed


});



export default model<IPropertyValue>( "PropertyValue", PropertyValueSchema );