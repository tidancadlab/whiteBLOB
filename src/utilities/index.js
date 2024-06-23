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

export const hashLightColors = [
  '#FFA07A', // Lighter Tomato
  '#B0C4DE', // Lighter Steel Blue
  '#7FFF00', // Lighter Lime Green
  '#FFFFE0', // Lighter Gold
  '#DA70D6', // Lighter Medium Orchid
  '#F0FFFF', // Lighter Aquamarine
  '#FFB6C1', // Lighter Hot Pink
  '#836FFF', // Lighter Slate Blue
  '#FFA07A', // Lighter Orange Red
  '#87CEFA', // Lighter Light Sea Green
  '#FFA07A', // Lighter Light Salmon (Adjust as per specific light shade)
  '#AFEEEE', // Lighter Dark Turquoise
  '#FFDAB9', // Lighter Dark Orange
  '#DB7093', // Lighter Medium Purple
  '#98FB98', // Lighter Spring Green
  '#FF69B4', // Lighter Dark Magenta
  '#FFE4B5', // Lighter Peach Puff
  '#ADD8E6', // Lighter Medium Sea Green
  '#FFB6C1', // Lighter Deep Pink
  '#87CEEB',
];
