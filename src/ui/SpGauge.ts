class SpGauge extends CoolingQueueMcForCircle{
	private _sp:SpWeapon
	public constructor(sp:SpWeapon, target: egret.DisplayObject, w:number) {
		super(target, w)
		this._sp = sp
		target.visible = true
		this.setProgress(100, 100)
	}


	public refresh(){
		const v = this._sp.restTimes
		this.setProgress(v,  100)
	}
}