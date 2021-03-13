import {model} from "mongoose";
import FamousBlockSchema, {IFamousBlockDocument} from "../MongoSchemesNew/FamousBlock";

export default model<IFamousBlockDocument>('FamousBlock', FamousBlockSchema);
