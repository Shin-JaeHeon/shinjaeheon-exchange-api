import request = require('request');
import requestPromise = require('request-promise');

const arrayLen24 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const remove = (str: string, remove: string) => {
  if (typeof str === 'string') return str.replace(remove, '');
};
const parseHTML = (html: Object) => {
  const list = [];
  const price = html['quoteSummary'].result[0]['price'];
  list.push(price.regularMarketPrice.raw);
  list.push(price.regularMarketChange.raw);
  list.push(price.regularMarketChangePercent.raw * 100);
  list.push(price.regularMarketPreviousClose.raw);
  list.push(price.regularMarketOpen.raw);
  list.push(price.regularMarketDayLow.raw);
  list.push(price.regularMarketDayHigh.raw);
  return list;
};
const req = (pair, errorHandler, callback) => request({
  url: `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${pair}=X?formatted=true&crumb=sxCZygzUaUK&lang=en-US&region=US&modules=price&corsDomain=finance.yahoo.com`,
  timeout: 10000,
  followRedirect: true,
  maxRedirects: 10
}, (err, response, html) => {
  try {
    if (err) errorHandler(err, pair);
    else callback(parseHTML(JSON.parse(html)), pair);
  } catch (e) {
    errorHandler(e, pair);
  }
});

/**
 * @deprecated
 */
export function getExchangeDataLowTrafficP(): Promise<Array<Array<any>>> {
  return new Promise<Array<Array<any>>>(((resolve, reject) => request({
    url: 'https://finance.yahoo.com/currencies',
    encoding: null
  }, (err, response, html) => {
    let h = html.toString().split(`data-reactid=\"75\"`)[2];
    if (err) reject(err);
    else {
      const pair = h.match(/>(...\/...)/gmi);
      const price = h.match(/">([0-9,.]+)/gmi);
      const changes = h.match(/ -->[^0-9reactsp/><\-]*[0-9.\-]+/gmi);
      if (changes === null) reject(new Error('Error code: GED-LTP'));
      else resolve(arrayLen24.map((v, a) => [remove(pair[a], '>'), parseFloat(remove(price[a], '\">')), parseFloat(remove(changes[a * 2], " -->")), parseFloat(remove(changes[a * 2 + 1], ' -->'))]));
    }
  })));
}

/**
 * @deprecated
 */
export function getExchangeDataLowTraffic(callback: (data: Array<Array<any>>) => any, errorHandler: (error: Error, pair?: String) => any = err => console.log(err)): void {
  try {
    request({
      url: 'https://finance.yahoo.com/currencies',
      encoding: null
    }, (err, response, html) => {
      let h = html.toString().split(`data-reactid=\"75\"`)[2];
      if (err) errorHandler(err, 'getExchangeDataLowTraffic');
      else {
        const pair = h.match(/>(...\/...)/gmi);
        const price = h.match(/">([0-9,.]+)/gmi);
        const changes = h.match(/ -->[^0-9reactsp/><\-]*[0-9.\-]+/gmi);

        if (changes === null) errorHandler(new Error('Error code: GED-LTC'), 'getExchangeDataLowTraffic');
        else callback(arrayLen24.map((v, a) => [remove(pair[a], '>'), parseFloat(remove(price[a], '\">')), parseFloat(remove(changes[a * 2], " -->")), parseFloat(remove(changes[a * 2 + 1], ' -->'))]));
      }
    });
  } catch (e) {
    errorHandler(e, 'getExchangeDataLowTraffic');
  }
}

export function getFxYahooJapan(callback: (data: Object) => any, errorHandler: (error: Error, pair?: String) => any = err => console.log(err)): void {
  try {
    request({
      url: 'https://info.finance.yahoo.co.jp/fx/list/',
      encoding: null
    }, (err, response, html) => {
      let h = html.toString();
      if (err) errorHandler(err, 'getFxYahooJapan');
      else {
        const data = h.match(/......_chart_...">[0-9.]*/gmi);
        let dv = {
          USDJPY: {},
          EURJPY: {},
          AUDJPY: {},
          GBPJPY: {},
          NZDJPY: {},
          CADJPY: {},
          CHFJPY: {},
          ZARJPY: {},
          CNHJPY: {},
          EURUSD: {},
          GBPUSD: {},
          AUDUSD: {},
          NZDUSD: {},
          HKDJPY: {},
          EURGBP: {},
          EURAUD: {},
          USDCHF: {},
          EURCHF: {},
          GBPCHF: {},
          AUDCHF: {},
          CADCHF: {},
          USDHKD: {}
        };
        Object.keys(dv).map(v =>
          dv[v] = data.reduce((prev, current) => {
            if (current.replace(/_.*/, '') === v) prev.push(parseFloat(current.replace(/......_chart_....>/, '')));
            return prev;
          }, []));
        callback(dv);
      }
    });
  } catch (e) {
    errorHandler(e, 'getFxYahooJapan');
  }
}

export function getExchangeDataArray(pair: any, callback: (data: number[], pair?: string) => any, errorHandler: (error: Error, pair?: String) => any = err => console.log(err)): void {
  try {
    if (typeof pair === 'string') req(pair, errorHandler, callback);
    else if (Array.isArray(pair)) pair.forEach(v => req(v, errorHandler, callback));
    else errorHandler(new Error('A pair must be "string" or "array".'), 'getExchangeArray');
  } catch (e) {
    errorHandler(e, 'getExchangeDataArray');
  }
}

/**
 * This function returns exchange data via Promise.
 * @param {string|Array<string>} pair ex) USDKRW, JPYKRW.
 */
export function getExchangeData(pair: string | Array<string>): Promise<Array<[number[], string]>> {
  const pairArray = typeof pair === 'string' ? [pair] : (Array.isArray(pair)) ? pair : null;
  return new Promise((resolve, reject) => !!pairArray ?
    Promise.all(pairArray.map(pair =>
      new Promise((resolve, reject) =>
        requestPromise({
          url: `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${pair}=X?modules=price`, json: true
        })
          .then(data => resolve(parseHTML(data)))
          .catch(err => reject([err, pair])))))
      .then((v: [number[], string][]) => resolve(v))
      .catch(v => resolve(v))
    : reject('A pair must be "string" or "array".'));
}

export function getPairArray(currency: Array<string>, base: Array<string>): Array<string> {
  let list: Array<string> = [];
  currency.forEach(v => base.forEach(v2 => {
    if (v2 !== v) list.push(v + v2);
  }));
  return list;
}

const whatCurrency = currency => {
  {
    switch (currency) {
      case 'AED':
        return 'د.إ';
      case 'AFN':
        return '؋';
      case 'ALL':
        return 'L';
      case 'AMD':
        return '֏';
      case 'ANG':
        return 'ƒ';
      case 'AOA':
        return 'Kz';
      case 'ARS':
        return '$';
      case 'AUD':
        return '$';
      case 'AWG':
        return 'ƒ';
      case 'AZN':
        return '₼';
      case 'BAM':
        return 'KM';
      case 'BBD':
        return '$';
      case 'BDT':
        return '৳';
      case 'BGN':
        return 'лв';
      case 'BHD':
        return '.د.ب';
      case 'BIF':
        return 'FBu';
      case 'BMD':
        return '$';
      case 'BND':
        return '$';
      case 'BOB':
        return '$b';
      case 'BRL':
        return 'R$';
      case 'BSD':
        return '$';
      case 'BTC':
        return '฿';
      case 'BTN':
        return 'Nu.';
      case 'BWP':
        return 'P';
      case 'BYR':
        return 'Br';
      case 'BYN':
        return 'Br';
      case 'BZD':
        return 'BZ$';
      case 'CAD':
        return '$';
      case 'CDF':
        return 'FC';
      case 'CHF':
        return 'CHF';
      case 'CLP':
        return '$';
      case 'CNY':
        return '¥';
      case 'COP':
        return '$';
      case 'CRC':
        return '₡';
      case 'CUC':
        return '$';
      case 'CUP':
        return '₱';
      case 'CVE':
        return '$';
      case 'CZK':
        return 'Kč';
      case 'DJF':
        return 'Fdj';
      case 'DKK':
        return 'kr';
      case 'DOP':
        return 'RD$';
      case 'DZD':
        return 'دج';
      case 'EEK':
        return 'kr';
      case 'EGP':
        return '£';
      case 'ERN':
        return 'Nfk';
      case 'ETB':
        return 'Br';
      case 'ETH':
        return 'Ξ';
      case 'EUR':
        return '€';
      case 'FJD':
        return '$';
      case 'FKP':
        return '£';
      case 'GBP':
        return '£';
      case 'GEL':
        return '₾';
      case 'GGP':
        return '£';
      case 'GHC':
        return '₵';
      case 'GHS':
        return 'GH₵';
      case 'GIP':
        return '£';
      case 'GMD':
        return 'D';
      case 'GNF':
        return 'FG';
      case 'GTQ':
        return 'Q';
      case 'GYD':
        return '$';
      case 'HKD':
        return '$';
      case 'HNL':
        return 'L';
      case 'HRK':
        return 'kn';
      case 'HTG':
        return 'G';
      case 'HUF':
        return 'Ft';
      case 'IDR':
        return 'Rp';
      case 'ILS':
        return '₪';
      case 'IMP':
        return '£';
      case 'INR':
        return '₹';
      case 'IQD':
        return 'ع.د';
      case 'IRR':
        return '﷼';
      case 'ISK':
        return 'kr';
      case 'JEP':
        return '£';
      case 'JMD':
        return 'J$';
      case 'JOD':
        return 'JD';
      case 'JPY':
        return '¥';
      case 'KES':
        return 'KSh';
      case 'KGS':
        return 'лв';
      case 'KHR':
        return '៛';
      case 'KMF':
        return 'CF';
      case 'KPW':
        return '₩';
      case 'KRW':
        return '₩';
      case 'KWD':
        return 'KD';
      case 'KYD':
        return '$';
      case 'KZT':
        return 'лв';
      case 'LAK':
        return '₭';
      case 'LBP':
        return '£';
      case 'LKR':
        return '₨';
      case 'LRD':
        return '$';
      case 'LSL':
        return 'M';
      case 'LTC':
        return 'Ł';
      case 'LTL':
        return 'Lt';
      case 'LVL':
        return 'Ls';
      case 'LYD':
        return 'LD';
      case 'MAD':
        return 'MAD';
      case 'MDL':
        return 'lei';
      case 'MGA':
        return 'Ar';
      case 'MKD':
        return 'ден';
      case 'MMK':
        return 'K';
      case 'MNT':
        return '₮';
      case 'MOP':
        return 'MOP$';
      case 'MRO':
        return 'UM';
      case 'MRU':
        return 'UM';
      case 'MUR':
        return '₨';
      case 'MVR':
        return 'Rf';
      case 'MWK':
        return 'MK';
      case 'MXN':
        return '$';
      case 'MYR':
        return 'RM';
      case 'MZN':
        return 'MT';
      case 'NAD':
        return '$';
      case 'NGN':
        return '₦';
      case 'NIO':
        return 'C$';
      case 'NOK':
        return 'kr';
      case 'NPR':
        return '₨';
      case 'NZD':
        return '$';
      case 'OMR':
        return '﷼';
      case 'PAB':
        return 'B/.';
      case 'PEN':
        return 'S/.';
      case 'PGK':
        return 'K';
      case 'PHP':
        return '₱';
      case 'PKR':
        return '₨';
      case 'PLN':
        return 'zł';
      case 'PYG':
        return 'Gs';
      case 'QAR':
        return '﷼';
      case 'RMB':
        return '￥';
      case 'RON':
        return 'lei';
      case 'RSD':
        return 'Дин.';
      case 'RUB':
        return '₽';
      case 'RWF':
        return 'R₣';
      case 'SAR':
        return '﷼';
      case 'SBD':
        return '$';
      case 'SCR':
        return '₨';
      case 'SDG':
        return 'ج.س.';
      case 'SEK':
        return 'kr';
      case 'SGD':
        return '$';
      case 'SHP':
        return '£';
      case 'SLL':
        return 'Le';
      case 'SOS':
        return 'S';
      case 'SRD':
        return '$';
      case 'SSP':
        return '£';
      case 'STD':
        return 'Db';
      case 'STN':
        return 'Db';
      case 'SVC':
        return '$';
      case 'SYP':
        return '£';
      case 'SZL':
        return 'E';
      case 'THB':
        return '฿';
      case 'TJS':
        return 'SM';
      case 'TMT':
        return 'T';
      case 'TND':
        return 'د.ت';
      case 'TOP':
        return 'T$';
      case 'TRL':
        return '₤';
      case 'TRY':
        return '₺';
      case 'TTD':
        return 'TT$';
      case 'TVD':
        return '$';
      case 'TWD':
        return 'NT$';
      case 'TZS':
        return 'TSh';
      case 'UAH':
        return '₴';
      case 'UGX':
        return 'USh';
      case 'USD':
        return '$';
      case 'UYU':
        return '$U';
      case 'UZS':
        return 'лв';
      case 'VEF':
        return 'Bs';
      case 'VND':
        return '₫';
      case 'VUV':
        return 'VT';
      case 'WST':
        return 'WS$';
      case 'XAF':
        return 'FCFA';
      case 'XBT':
        return 'Ƀ';
      case 'XCD':
        return '$';
      case 'XOF':
        return 'CFA';
      case 'XPF':
        return '₣';
      case 'YER':
        return '﷼';
      case 'ZAR':
        return 'R';
      case 'ZWD':
        return 'Z$';
      default:
        return undefined;
    }
  }
};

export function getUnit(currency: string): any {
  currency = currency.trim().toUpperCase();
  if (currency.length === 3) return whatCurrency(currency);
  else {
    let temp = "";
    let list = [];
    for (let a of currency) {
      temp += a;
      if (temp.length === 3) {
        list.push(whatCurrency(temp));
        temp = "";
      }
    }
    return list;
  }
}
