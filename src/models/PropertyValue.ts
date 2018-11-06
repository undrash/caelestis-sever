

import Object from "../models/Object";
import { Schema } from "mongoose";
import { IPropertyValue } from "./interfaces/IPropertyValue";
import { DataTypes } from "../constants/DataTypes";





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


    displayValue: {
        type: String
    },


    value: Schema.Types.Mixed


});


// /** Workaround for automatically registering value updates */
//
// PropertyValueSchema.pre( "validate", function (next) {
//     this.markModified( "value" );
//     next();
// });


/** Assign display value to lookup */

PropertyValueSchema.pre( "validate", function (next) {
    const PropertyValue = this as any;
    const value = PropertyValue.value;

    if ( ! value ) {
        next();
        return;
    }

    if ( PropertyValue.dataType === DataTypes.LOOKUP ) {
        console.log( "LOOKUP PROPERTY FOUND BEFORE SAVE" );

        Object.findById( value )
            .populate( "type" )
            .then( (object) => {

                const { nameProperty } = ( object as any ).type;

                console.log( "nameproperty: " + nameProperty );

                for ( let propVal of object.properties ) {

                    if ( nameProperty.toString() === propVal.propertyDef.toString() ) {

                        console.log( "name property located, value inherited: " + propVal.value );

                        PropertyValue.displayValue = propVal.value;

                        next();
                    }

                }

                next();



            })
    } else {
        PropertyValue.displayValue = value;
        next();
        //TODO: maybe handle dates differently
    }
});



export default PropertyValueSchema as IPropertyValue;