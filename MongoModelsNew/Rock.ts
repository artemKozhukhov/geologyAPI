import  {model } from "mongoose";
import RockSchema, {IRockDocument} from "../MongoSchemesNew/Rock";

export default model<IRockDocument>('Rock', RockSchema);
