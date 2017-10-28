import moment from 'moment';

export function maxLength(length, str, ellipsis = true) {
  if(!str) return;
  return str.slice(0, length) + (ellipsis ? "..." : "")
}

export function bigNumber(n) {
  // FIXME Implement this in a better way
  return n.toString();
}

export function formatTimestamp(timestamp) {
  return moment.unix(timestamp).format()
}