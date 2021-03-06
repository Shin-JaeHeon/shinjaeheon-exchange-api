# yahoo-exchange
[![npm](https://img.shields.io/npm/v/yahoo-exchange.svg?style=flat-square)](https://www.npmjs.com/package/yahoo-exchange)
[![npm](https://img.shields.io/npm/dt/yahoo-exchange.svg?style=flat-square)](https://www.npmjs.com/package/yahoo-exchange)
[![npm](https://img.shields.io/npm/l/yahoo-exchange.svg?registry_uri=https%3A%2F%2Fregistry.npmjs.com&style=flat-square)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/badge/InternetExplorer-Not%20Support-red.svg?style=flat-square)](https://kangax.github.io/compat-table/es6/)
[![npm](https://img.shields.io/badge/Readme-English-lightgray.svg?style=flat-square)](https://github.com/Shin-JaeHeon/yahoo-exchange/blob/master/README.md)
[![npm](https://img.shields.io/badge/Readme-한국어-blue.svg?style=flat-square)](https://github.com/Shin-JaeHeon/yahoo-exchange/blob/master/README-KR.md)
[![npm](https://img.shields.io/badge/Readme-日本語-orange.svg?style=flat-square)](https://github.com/Shin-JaeHeon/yahoo-exchange/blob/master/README-JP.md)

## getExchangeData(pair): Promise<Array<[number[], string]>> 
* pair : string or Array\<string\>
* number[] : [Now, Changes, Changes percent, Previous Close, Open, Day's Range Min, Day's Range Max]
* string[] : pair 

Unlike `getExchangeDataArray`, it waits for all requests to complete before returning to `Promise`.

This method was created on 2018.09.02(KST)

## getExchangeDataArray(pair, callback, errorHandler): void
* pair : string or Array\<string\>
* callback : (Array\<number\>, pair) => any
* errorHandler : options (A default method is  ```console.log(error)```) 
> ### Introduction to v2.0.0
> 52 Week Range Min, 52 Week Range Max, Bid, Ask have been removed from the returned items.

Array\<number\> : [Now, Changes, Changes percent, Previous Close, Open, Day's Range Min, Day's Range Max]

### Warning
getExchangeDataArray does not return Arrays to Callback.

## getExchangeDataLowTraffic() @deprecated
> deprecated Since version 2.0.2. Will be deleted in version 3.0. Use getExchangeDataArray instead.
## getExchangeDataLowTrafficP() @deprecated
> deprecated Since version 2.0.2. Will be deleted in version 3.0. Use getExchangeDataArray instead.
## getFxYahooJapan(callback, errorHandler): void 

* callback : (data:Object)=> any
> data = { 'USDJPY':\[100.05,100.15\], ... more 21 data }

* errorHandler : options (A default method is ```err => console.log(err)```)
It does return fx data (bid and ask) in 5m chart (5分足)
### What pairs are available?
* USDJPY, EURJPY, AUDJPY, GBPJPY, NZDJPY, CADJPY, CHFJPY, ZARJPY, CNHJPY
* EURUSD, GBPUSD, AUDUSD, NZDUSD, HKDJPY
* EURGBP
* EURAUD
* USDCHF, EURCHF, GBPCHF, AUDCHF, CADCHF
* USDHKD
##  getPairArray(currency: Array<string>, base: Array<string>): Array<string>
It returns a pair array.
## getUnit(currency:string):string or Array<string>
It Returns a currency sign or a list of currency sign.
## A copyright notice on the library used
Some of the code from the library below has been included in this project.
* [currency-symbol-map](https://github.com/bengourley/currency-symbol-map)
