


import { Document } from "mongoose";
import { IOption } from "./IOption";





export interface IOptions extends Document {
    name: string,
    options: IOption[]
}