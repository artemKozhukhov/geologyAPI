import {model} from "mongoose";
import UserSchema, {IUserDocument} from "../MongoSchemesNew/User";

export default model<IUserDocument>('User', UserSchema);
