

import { Document, Schema } from "mongoose";
import { IPropertyValue } from "./IPropertyValue";





export interface IObject extends Document {
    name: string;
    type: Schema.Types.ObjectId,
    properties: IPropertyValue[]
}