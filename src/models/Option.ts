

import { IOption } from "./interfaces/IOption";
import { Schema } from "mongoose";






const OptionSchema = new Schema({

    name: {
        type: String,
        required: true,
        validate: {
            validator: (name) => name.length > 0 && name.length <= 30,
            message: "Option name has to to be at least one character in length, but not longer than 30."
        }
    },

    image: {
        type: String,
        validate: {
            validator: (url) => url.length > 0 && url.length <= 500,
            message: "Option URL has to to be at least one character in length, but not longer than 500."
        }
    }

});


export default OptionSchema as IOption;