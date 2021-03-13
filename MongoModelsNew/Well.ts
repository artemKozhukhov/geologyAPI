import {model} from "mongoose";
import WellSchema, {IWellDocument} from "../MongoSchemesNew/Well";

export default model<IWellDocument>('Well', WellSchema);
