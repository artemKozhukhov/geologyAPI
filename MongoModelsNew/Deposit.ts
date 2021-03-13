import  {model, Model } from "mongoose";
import DepositSchema, {IDepositDocument} from "../MongoSchemesNew/Deposit";

// interface IDepositModel extends Model<IDepositDocument> {}
//
// export default model<IDepositDocument, IDepositModel>('Deposit', DepositSchema);

export default model('Deposit', DepositSchema);
