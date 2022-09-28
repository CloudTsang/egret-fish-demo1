class Laser extends SpWeapon{
	private _triggered:boolean = false
	private _triggered2:boolean = false
	private _mask:egret.DisplayObject
	private _filter:egret.GlowFilter
	private _tw:egret.Tween
	private _side:"L"|"R"
	public constructor(canon:Canon, index:number) {
		super(5, SpWeaponTimesUnit.TIME, canon, index)
		this.position = new egret.Point(canon.x, canon.y)
	}

	public shot(tgtx:number=0, tgty:number=0){
		const t = this
		if(t._triggered) return
		t._triggered = true
		t.draw()
		t.x = t._canon.x
		t.y = t._canon.y
		t.rotation = t._canon.rotation-90
		t._side = t._canon.rotation<0?"L":"R"
		t._canon.parent && t._canon.parent.addChildAt(t, 1)
		SoundManager.instance().playBgs('bgs_railgun_mp3')
		t._tw = egret.Tween.get(t)
		.to({
			scaleX:150
		}, 500)
		.set({
			_triggered2: true
		})

	}

	public dispose(){
		const t = this
		t._tw = egret.Tween.get(t)
		.to({
			scaleY:0
		},500)
		.call(()=>{
			t.activate = false;
			t.parent && t.parent.removeChild(this);	
			t._triggered = false
		}).play()
	}

	public timePassed(){
		const t = this
		if(!t._triggered) return
		t._times --
		if(t._times<=0) t.dispatchEvent(new egret.Event(GameEvents.SP_OVER))
	}

	public collisionCheck(obj:Fish){
		const t = this
		if(!t._triggered2) return
		const should = t.shouldCollisionCheck
		if(!should) return false
		if(t._side == 'L' && obj.position.x > t.x) return false
		else if(t._side == 'R' && obj.position.x < t.x) return false
		for(let cp of obj.collisionPoints){
			if(t.hitTestPoint(cp.x, cp.y)) return true
		}
		return false
	}

	protected draw(){
		const t = this
		const size = 60
		const ulength = size * 1.5

		let sp:egret.Sprite = new egret.Sprite();
		sp.graphics.beginFill(0xFFFFFF);		
		sp.graphics.drawRect(0,0 , 2000, size );		
		sp.graphics.endFill();		
		const filter =  new egret.GlowFilter(0x87CEEB, 0.3, 10, 10, 20, 1, true, false);
		sp.filters = [filter]	
		

		let mask:egret.Shape = new egret.Shape();
		mask.graphics.beginFill(0xFFFFFF);
		mask.graphics.drawRoundRect(0,0 , 10, size, ulength, ulength);		
		mask.graphics.endFill();		
		
		t.addChild(sp)
		t.addChild(mask)
		t.anchorOffsetY = size/2
		sp.mask = mask

		t._sp = sp
		t._mask = mask
		t._filter = filter
	}	
}