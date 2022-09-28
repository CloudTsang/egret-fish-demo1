class SpWeaponPanel extends eui.Component{
	public btnLaser:eui.Image
	public btnMissle:eui.Image
	public btnYoyo:eui.Image
	public gaugeLaser:eui.Rect
	public gaugeMissle:eui.Rect
	public gaugeYoyo:eui.Rect
	protected pint:eui.Image
	private _pintTw:egret.Tween
	public constructor() {
		super()
		this.skinName = 'resource/eui_skins/skin/sppanel.exml'
		this.touchEnabled = false
		this.touchChildren = true
		this.once(eui.UIEvent.CREATION_COMPLETE, this.onComplete, this)
	}

	protected onComplete(e:any){
		const t = this
		t.addEventListener("touchTap", t.onClick, t)

		t._pintTw = egret.Tween.get(t.pint, {loop:true})
		.to({y:-20}, 200)
		.to({y:0}, 100)
		.wait(500)
		t._pintTw.setPaused(true)
	}

	public set pState(v:WeaponState){
		const t = this
		if(v != WeaponState.NORMAL){
			t._pintTw.setPaused(true)
		}
		console.log(v)
		switch(v){
			case WeaponState.NULL:
			t.visible = false
			break
			case WeaponState.NORMAL:
			t.visible = true
			t.currentState = 'normal'
			t._pintTw.setPaused(false)
			break
			case WeaponState.LASER:
			t.currentState = 'laser'
			break
			case WeaponState.MISSLE:
			t.currentState = 'missle'
			break
			case WeaponState.YOYO:
			t.currentState = 'yoyo'
			break
		}
	}


	protected onClick(e:egret.TouchEvent){
		const t = this
		if(t.currentState != 'normal') return
		let evt = new egret.Event(GameEvents.SP_CHOSEN)
		switch(e.target){
			case t.btnLaser:
			console.log("选择特殊武器：激光")
			evt.data = {type:WeaponState.LASER}
			break
			case t.btnMissle:
			console.log("选择特殊武器：炮弹")
			evt.data = {type:WeaponState.MISSLE}
			break
			case t.btnYoyo:
			console.log("选择特殊武器：铁球")
			evt.data = {type:WeaponState.YOYO}
			break
		}
		t.dispatchEvent(evt)
	}
}

enum WeaponState{
	NULL, NORMAL, LASER, MISSLE, YOYO
}
