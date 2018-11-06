

import { Document, Schema } from "mongoose";





export interface IPropertyDef extends Document {
    user: Schema.Types.ObjectId,
    name: string,
    dataType: number,
    objectType: Schema.Types.ObjectId,
    requiredFor: Schema.Types.ObjectId[]
}