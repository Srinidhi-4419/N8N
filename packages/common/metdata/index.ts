export const SUPPORTED_ASSETS=["BTC","SOL"];
export type TradingMetadata={
    type:"Long" | "Short",
    qty:number,
    symbol :typeof SUPPORTED_ASSETS
}
export type PriceNodeMetaData={
    asset:string,
    price:number,
}
        
        
export type TimerNodeMetaData={
    time:number;
}