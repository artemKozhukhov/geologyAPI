import { Schema, Document } from "mongoose";

export interface IUser {
  firstName: string,
  secondName: string,
}

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema(
  {
    firstName: Schema.Types.String,
    secondName: Schema.Types.String,
  }
);

export default UserSchema;
