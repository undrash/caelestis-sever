

import { Document, Schema } from "mongoose";





export interface IPropertyValue extends Document {
    name: string,
    dataType: number,
    propertyDef: Schema.Types.ObjectId,
    value: Schema.Types.Mixed
}