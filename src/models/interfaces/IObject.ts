

import { Document, Schema } from "mongoose";
import { IPropertyValue } from "./IPropertyValue";





export interface IObject extends Document {
    type: Schema.Types.ObjectId,
    nameProperty: Schema.Types.ObjectId;
    properties: IPropertyValue[]
}