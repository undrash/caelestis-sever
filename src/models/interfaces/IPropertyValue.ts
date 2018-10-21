

import { Schema } from "mongoose";





export interface IPropertyValue extends Schema {
    name: string,
    dataType: number,
    propertyDef: Schema.Types.ObjectId,
    displayValue: string,
    value: Schema.Types.Mixed
}