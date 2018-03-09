import request = require("request");

export function getData(pair: string, callback: (data: number, pair?: string) => any, errorHandler: (error: Error, pair?: String) => any = err => console.log(err)): void {
    request({
        url: `https://finance.yahoo.com/quote/${pair}=X?p=${pair}=X`,
        encoding: null,
    }, (err, response, html) => {
        if (err) errorHandler(err, pair);
        else callback(parseFloat(html.toString().split('react-text: 36 -->')[1].split('<')[0].replace(',', '')), pair);
    });
}

export function getDataArray(pair: Array<string>, callback: (data: number, pair?: string) => any, errorHandler: (error: Error, pair?: String) => any = err => console.log(err)): void {
    pair.map(v => request({
        url: `https://finance.yahoo.com/quote/${v}=X?p=${v}=X`,
        encoding: null,
    }, (err, response, html) => {
        if (err) errorHandler(err, v);
        else callback(parseFloat(html.toString().split('react-text: 36 -->')[1].split('<')[0].replace(',', '')), v);
    }));
}

export function getPairArray(currency: Array<string>, base: Array<string>): Array<string> {
    let list: Array<string> = [];
    currency.forEach(v => base.forEach(v2 => {
        if (v2 !== v) list.push(v + v2);
    }));
    return list;
}