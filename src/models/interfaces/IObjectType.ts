

import { Document, Schema } from "mongoose";





export interface IObjectType extends Document {
    name: string,
    properties: Schema.Types.ObjectId[]
}