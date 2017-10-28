
export const TRANSACTION = 'TX';
export const ADDRESS = 'ADDRESS';
export const BLOCK = 'BLOCK';

// FIXME
export function getStringType(str) {
  var regexpTx = /[0-9a-zA-Z]{64}?/;
  //var regexpAddr =  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/; // TODO ADDR REGEX or use isAddress(hexString) API ?
  var regexpAddr = /^(0x)?[0-9a-f]{40}$/; //New ETH Regular Expression for Addresses
  var regexpBlock = /[0-9]{1,7}?/;

  var result = regexpTx.test(str);
  if (result === true) {
    return TRANSACTION;
  } else {
    result = regexpAddr.test(str.toLowerCase());
    if (result === true) {
      return ADDRESS;
    } else {
      result = regexpBlock.test(str);
      if (result === true) {
        return BLOCK;
      } else {
        return null;
      }
    }
  }
}