class MissleLauncher extends SpWeapon{
	private _missles:Missle[]
	public constructor(canon:Canon, index:number) {
		super(3, SpWeaponTimesUnit.SHOT, canon, index)
		this._missles = []
		this.position = new egret.Point(canon.x, canon.y)
		this._maxDmgCounter = 3
		// this._dmgCounter = 0
	
	}

	public timePassed(){
		let overed:number = 0
		for(let m of this._missles){
			m.refresh()
			overed += m.overed?1:0
		}
		if(overed == 3) this.dispatchEvent(new egret.Event(GameEvents.SP_OVER))
		
	}

	public shot(tgtx:number=0, tgty:number=0){
		const t = this
		if(t._times <= 0) return
		const m = t.drawMissle()
		t._canon.parent.addChildAt(m, 1)
		t._missles.push(m)
		t._times --
	}

	private drawMissle(){
		const t = this
		let d = egret.MainContext.instance.stage.stageHeight * 0.8
		if(Math.abs(t._canon.rotation) > 45) d = egret.MainContext.instance.stage.stageHeight
		const sp = new Missle(d)
		sp.setDirection(t._canon.rotation)
		sp.x = t._canon.x
		sp.y = t._canon.y
		return sp
	}

	public collisionCheck(f:Fish){
		const t = this
		const should = t.shouldCollisionCheck
		if(!should) return false
		for(let m of t._missles){
			const csp = m.crashSp
			if(!csp) continue
			const r = csp.width * csp.scaleX/2
			const d = egret.Point.distance(m.position, f.position)
			if(d < r) return true
		}
	}
}

class Missle extends BaseCharacter{
	private _aniTime:number
	private _blasted:boolean
	private _overed:boolean
	private _overed2:boolean
	private _sp:egret.DisplayObject
	constructor(distance:number, spd:number=20){
		super()
		this._aniTime = Math.round(distance/spd)
		this.moveData = new MoveData()
		this.moveData.setData(0, spd)
		this._blasted = false
		this._overed2 = false
		this.draw()
	}

	public get overed(){
		return this._overed
	}

	public setDirection(rot:number=0, spd=-1){
		if(spd == -1) spd = this.moveData.speed
		this.moveData.setData(rot,spd)
		this.rotation = rot
	}

	public refresh(){
		const t = this
		if(t._overed2) return
		if(t._aniTime == 0){
			if(t._blasted){
				t._overed2 = true
				egret.Tween.get(t._sp)
				.to({
					alpha:0
				}, 500)
				.call(()=>{
					t._overed = true
					t._sp.parent && t._sp.parent.removeChild(t._sp)
					t._sp = null
				})
				
			}else{
				t._aniTime = 21
				t.blast()
				t.position = new egret.Point(t.x, t.y)
				SoundManager.instance().playBgs('explode_mp3')
			}
		}else{
			if(t._blasted){
				t._aniTime --
				t._sp.scaleX += 0.15
				t._sp.scaleY += 0.15
			}else{
				t._aniTime --
				const {dx, dy} = t.moveData.getDAxis()
				t.x += dx
				t.y += dy
			}
		}
		
	}

	protected draw(){
		let sp = new egret.Bitmap(RES.getRes('misslep_png'))
		sp.scaleX = 2
		sp.scaleY = 2
		sp.anchorOffsetX = sp.width/2
		this._sp = sp
		this.addChild(sp)
	}

	public blast(){
		const t = this
		const p = t._sp.parent
		if(t._sp) p.removeChild(t._sp)
		let sp = new egret.Bitmap(RES.getRes('blast_png'))
		sp.anchorOffsetX = sp.width/2
		sp.anchorOffsetY = sp.height/2
		sp.scaleX = 0.1
		sp.scaleY = 0.1
		p.addChild(sp)
		t._sp = sp
		t._blasted = true
	}

	public get crashSp(){
		if(!this._blasted) return null
		else return this._sp
	}

	public get crashSpR(){
		if(!this._blasted) return -1
		else return this._sp.width * this._sp.scaleX / 2
	}
}