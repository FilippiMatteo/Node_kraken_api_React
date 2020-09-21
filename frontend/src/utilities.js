export const isFiat = function (pair) {
  if (pair === "USD" ||
    pair === "EUR" ||
    pair === "GBP" ||
    pair === "JPY" ||
    pair === "CHF" ||
    pair === "AUS") {
    return true
  } else {
    return false;
  }
}

export const getFiatChar = function (pair) {
  let ris = "";
  switch (pair) {
    case "USD":
      ris = "$";
      break;
    case "EUR":
      ris = "€";
      break;
    case "GBP":
      ris = "€";
      break;
    case "JPY":
      ris = "Y";
      break;
    case "CHF":
      ris = "C";
      break;
    case "AUS":
      ris = "AUD";
      break;
    default:
  }
  return ris;
}

export const fetchDataFromApi = async function (param) {

    const rawData = await fetch('http://127.0.0.1:5555/kraken/'+param);

    return  await rawData.json();

}

export const zeroResult = function () {

}
