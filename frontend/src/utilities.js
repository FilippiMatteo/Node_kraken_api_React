export const isFiat = function (pair){
  if (pair === "USD" | "EUR" | "GBP" | "JPY" | "CHF" | "AUS" ){
    return true
  }else{
   return false;
  }
}