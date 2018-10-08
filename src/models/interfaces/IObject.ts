

import { Document, Schema } from "mongoose";





export interface IObject extends Document {
    type: Schema.Types.ObjectId,
    properties: Schema.Types.ObjectId[]
}