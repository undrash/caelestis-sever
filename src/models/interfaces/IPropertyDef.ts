

import { Document, Schema } from "mongoose";





export interface IPropertyDef extends Document {
    name: string,
    dataType: number,
    requiredFor: Schema.Types.ObjectId[]
}