exports.getUniqueUsername = str => {
  let username = '';
  if (str.includes('@')) {
    const firstStr = str.split('@')[0];
    username = firstStr.toString() + Math.random().toString(36).substring(2, 6);
  } else {
    username = str.toString() + Math.random().toString(36).substring(2, 6);
  }
  return username;
};

exports.getTemporaryUniquePass = () => {
  let password = Array(8)
    .fill('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')
    .map(function (x) {
      return x[Math.floor(Math.random() * x.length)];
    })
    .join('');
  if (!/\d/.test(password)) {
    password = `${password}3`;
  }
  if (!password.match(/^[A-Z]*$/)) {
    // matches
    password = `${password}A`;
  }
  return password;
};

exports.getUniqueReferralCode = () => {
  const head = Date.now().toString(36);
  const tail = Math.random().toString(36).substring(2);
  return `${tail}${head}`.substring(2, 10).toLocaleLowerCase();
};

exports.randomString = (length = 8) => {
  let result = '';
  let chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  for (let i = length; i > 0; --i)
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  let data = result.toLocaleLowerCase().toString();
  return data;
};
