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

export const fetchDataFromApi = async function (queryString,param, type) {


  const rawData = await fetch('http://127.0.0.1:5555/kraken/'+queryString, {
    method: type || "GET",
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(param)
  }).catch((e) => {
    console.error(e)
    alert(e)
  });


    return  await rawData.json();

}

export const findObj = function (obj,p) {
  let val;
  Object.entries(obj).map(([key, value], i) => {
    if (key === p) {
      val = value;
    }
    return val
  });
  return val;
}

export const groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});


export const zeroResult = function () {

}
