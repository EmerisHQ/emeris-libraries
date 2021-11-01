import { ClientLibrary } from '@@/types/libraries';
import CosmJS from './cosmjs';

const libs = {
  [ClientLibrary.COSMJS]: CosmJS,
};
export default libs;
