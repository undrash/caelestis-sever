

import { Schema, model } from "mongoose";

import { IPropertyDef } from "./interfaces/IPropertyDef";





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


    requiredFor: {
        type: [ Schema.Types.ObjectId ],
        ref: ""
    }

});



export default model<IPropertyDef>("PropertyDef", PropertyDefSchema );