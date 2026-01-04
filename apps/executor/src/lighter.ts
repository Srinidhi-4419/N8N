
export function execute(asset:"SOL" | "ETH"|"BTC",qty:number,side:"LONG"|"SHORT",API_KEY:string){
console.log("executing trade on lighter");
console.log(`${asset},${qty}.${API_KEY}.${side}`)
}