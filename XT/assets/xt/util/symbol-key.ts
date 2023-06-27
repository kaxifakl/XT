class SymbolKey {
    private count: number = 0;
    public getKey(symbol?: string): string {
        symbol = symbol || 'symbol-'
        return symbol + this.count++;
    }
}

declare global {
    interface IXT {
        symbolKey: SymbolKey
    }
}

export { }

xt.symbolKey = xt.symbolKey || new SymbolKey();