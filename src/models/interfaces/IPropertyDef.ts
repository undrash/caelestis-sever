

import { Document, Schema } from "mongoose";





export interface IPropertyDef extends Document {
    name: string,
    dataType: number,
    objectType: string,
    requiredFor: Schema.Types.ObjectId[]
}