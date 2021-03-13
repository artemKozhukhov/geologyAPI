import {model} from "mongoose";
import BlockModelSchema, {IBlockModelDocument} from "../MongoSchemesNew/BlockModel";

export default model<IBlockModelDocument>('BlockModel', BlockModelSchema);
