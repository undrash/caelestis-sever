


import { Document, Schema } from "mongoose";
import { IOption } from "./IOption";





export interface IOptions extends Document {
    user: Schema.Types.ObjectId,
    name: string,
    options: IOption[]
}