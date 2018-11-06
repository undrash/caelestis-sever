

import { Document, Schema } from "mongoose";





export interface IObjectType extends Document {
    user: Schema.Types.ObjectId,
    name: string,
    nameProperty: Schema.Types.ObjectId,
    properties: Schema.Types.ObjectId[]
}