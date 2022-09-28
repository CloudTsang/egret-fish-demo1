class SpWeapon extends Bullet{
	protected _times:number
	protected _totTimes:number
	protected _unit:SpWeaponTimesUnit
	protected _canon:Canon

	private _index:number
	/**碰撞检测计数 */
	protected _dmgCounter:number
	protected _maxDmgCounter:number = 5
	public constructor(tot:number, unit:SpWeaponTimesUnit, canon:Canon, index:number) {
		super()
		if(unit == SpWeaponTimesUnit.TIME) tot *=  egret.MainContext.instance.stage.frameRate
		this._index = index
		this._totTimes = tot
		this._times = tot
		this._unit = unit
		this._canon = canon
		this._dmgCounter = this._maxDmgCounter
	}

	public get index(){
		return this._index
	}

	public shot(tgtx:number=0, tgty:number=0){
		const t = this
		//code

		if(t._unit!=SpWeaponTimesUnit.SHOT) return
		t._times --
		if(t._times<=0) t.dispatchEvent(new egret.Event(GameEvents.SP_OVER))
	}

	public timePassed(){
		const t = this
		if(t._unit!=SpWeaponTimesUnit.TIME) return
		t._times --
		if(t._times<=0) t.dispatchEvent(new egret.Event(GameEvents.SP_OVER))
	}

	public get times():number{
		return this._times
	}

	public get restTimes():number{
		return Math.floor((this._times/this._totTimes)*100)
	}

	public get shouldCollisionCheck(){
		const t = this
		if(!t.position) return false
		t._dmgCounter --
		if(t._dmgCounter > 0){
			return false
		}
		t._dmgCounter = t._maxDmgCounter
		return true
	}

}

enum SpWeaponTimesUnit{
	TIME, SHOT
}