import deposit from './deposit';
import famousBlocks from './famousBlocks';
import rocks from './rocks';
import well from './well';

export default (app) => {
  deposit(app);
  famousBlocks(app);
  rocks(app);
  well(app);
}
