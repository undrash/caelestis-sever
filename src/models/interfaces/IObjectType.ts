

import { Document, Schema } from "mongoose";





export interface IObjectType extends Document {
    name: string,
    nameProperty: Schema.Types.ObjectId,
    properties: Schema.Types.ObjectId[]
}