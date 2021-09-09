export default function (value, decimalPoint = 2) {
  if (value === undefined || value === null || value === 0) {
    return '0 Bytes';
  }

  const k = 1000;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(value) / Math.log(k));
  const result = parseFloat((value / Math.pow(k, i)).toFixed(decimalPoint));

  return `${result} ${sizes[i]}`;
}
