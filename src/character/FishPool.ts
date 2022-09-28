class FishPool {
	private static _ins:FishPool = new FishPool()
	public static get instance(){return FishPool._ins}
	public arr:Fish[] = []
	constructor() {
	}

	public getOne():Fish{
		const r = Math.random()
		let raw:IFishRawData
		let ret:Fish
		for(let i of this.fishData){
			if(i.rate > r){
				raw = i
				break
			}
		}
		for(let f of this.arr){
			if(!f.activate && f.type == raw.type){
				ret = f
				break
			}
		}
		if(!ret){
			ret = new Fish(raw)
			this.arr.push(ret)
		} 
		ret.activate = true
		return ret
	}

	private readonly fishData:IFishRawData[] = [
		{type:1, rate:0.3, speed: 7, hp: 1, score: 100, size: 80, imgUrl:'795548_png', hpNotReset:0},
		{type:2, rate:0.55, speed: 9, hp: 2, score: 200, size: 80, imgUrl:'43a048_png', hpNotReset:0.1},
		{type:3, rate:0.7, speed: 10, hp: 2, score: 350, size: 70, imgUrl:'aa47bc_png', hpNotReset:0.2},
		{type:4, rate:0.85, speed: 12, hp: 3, score: 500, size: 60, imgUrl:'d50000_png', hpNotReset:0.3},
		{type:5, rate:0.97, speed: 15, hp: 4, score: 700, size: 55, imgUrl:'ff6f00_png', hpNotReset:0.5},

		{type:6, rate:0.99, speed: 12, hp: 5, score: 10, size: 45, imgUrl:'c0ca33_png', hpNotReset:0, 
			filterFunc:()=>{
				return Filters.glowFilter1
			}},
		{type:7, rate:1, speed: 20, hp: 5, score: 1000, size: 40, imgUrl:'ffc107_png', hpNotReset:1,
			filterFunc:()=>{
				return Filters.glowFilter2
			}},
	]
}