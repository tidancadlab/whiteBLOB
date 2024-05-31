export const apiStateStatus = {
  initial: 'INITIAL',
  pending: 'PENDING',
  resolved: 'RESOLVED',
  rejected: 'REJECTED',
};

export const minToTime = (d) => {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? (h > 9 ? '' : '0') + h + ':' : '';
  var mDisplay = true ? (m > 9 ? '' : '0') + m + ':' : '';
  var sDisplay = true ? (s > 9 ? '' : '0') + s : '';
  return hDisplay + mDisplay + sDisplay;
};
