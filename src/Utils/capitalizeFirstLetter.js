export const CapitalizeFirstLetter = (str) => {
  const formattedString =
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  return formattedString;
};
