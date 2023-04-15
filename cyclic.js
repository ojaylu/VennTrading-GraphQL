const url = "https://defiant-duck-suspenders.cyclic.app/";

export function getSymbolInfo(symbol) {
    return fetch(url + `api/symbols/${symbol}`)
        .then(res => res.json())
        .then(data => data.props);
}

export async function getSymbols() {
    return fetch(url + "api/symbols")
        .then(res => res.json());
}