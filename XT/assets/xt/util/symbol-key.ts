class SymbolKey {
    private count: number = 0;
    /**获取唯一key
     * @param symbol 标记,默认为`symbol-`
     * @returns 
     */
    public getKey(symbol?: string): string {
        symbol = symbol || 'symbol-'
        return symbol + this.count++;
    }
}

declare global {
    interface IXT {
        /**唯一key */
        symbolKey: SymbolKey
    }
}

export { }

xt.symbolKey = xt.symbolKey || new SymbolKey();