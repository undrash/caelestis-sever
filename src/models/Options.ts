

import { IOptions } from "./interfaces/IOptions";
import { Schema, model } from "mongoose";
import OptionSchema from "./Option";






const OptionsSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },


    name: {
        type: String,
        required: true,
        validate: {
            validator: (name) => name.length > 0 && name.length <= 30,
            msg: "Options name has to to be at least one character in length, but not longer than 30."
        }
    },

    options: {
        type: [ OptionSchema ],
        default: []
    }


});



export default model<IOptions>( "Options", OptionsSchema );