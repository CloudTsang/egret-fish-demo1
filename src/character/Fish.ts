class Fish extends BaseCharacter implements IPoolObject{
	private _speed:number
	private _hp:number
	private _maxhp:number
	private _score:number
	private _size:number
	private _img:egret.Bitmap
	private _imgContainer:egret.Sprite
	private _imgUrl:string
	private _filter:egret.GlowFilter
	private _rate:number
	private _type:number
	private _shp:egret.Sprite

	private _particle:particle.GravityParticleSystem
	private _white:egret.Shape
	private _whiteCounter:number
	private _hpreset:boolean

	private _maxMoveCounter:number
	private _curMoveCounter:number
	private _dRotation:number

	public activate:boolean = false;

	
	public constructor(obj:IFishRawData) {
		super()
		const t = this
		t.touchEnabled = false
		
		t._rate = obj.rate
		t._type = obj.type
		t._speed = obj.speed
		t._hp = obj.hp
		t._maxhp = obj.hp
		t._score = obj.score
		t._size = obj.size
		t._imgUrl = obj.imgUrl
		t._hpreset = Math.random() > obj.hpNotReset
		t.draw()
		if(obj.filterFunc){
			t._img.filters = [obj.filterFunc()]
		}
		t._img.cacheAsBitmap = true
		t._imgContainer.cacheAsBitmap = true
		
		t.rotation = -90
		t.moveData = new MoveData()
		t.moveData.setData(t.rotation, t._speed)
		t._maxMoveCounter = egret.MainContext.instance.stage.frameRate
		t._curMoveCounter = 0//t._maxMoveCounter
		t._dRotation = t.rotation
		t._whiteCounter = 100

		t._collisionPoints = [
			new egret.Point(0, 0),
			new egret.Point(t._img.width, 0),
			new egret.Point(0, t._img.height),
			new egret.Point(t._img.width, t._img.height),
			new egret.Point(t._img.width/2, t._img.height/2)
		]
	}

	protected draw(){
		const t = this
		const tex = RES.getRes(t._imgUrl)
		const img = new egret.Bitmap(tex)
		img.width = t._size
		img.height = t._size * 1.5
		
		const ptcConfig = RES.getRes('fishParticle_json')
		ptcConfig.startSize = t._size * 0.75
		const ptc = new particle.GravityParticleSystem(tex, ptcConfig);
		ptc.initConfig
		ptc.x = img.width/2
		ptc.y = img.height
		t.addChild(ptc);	
		ptc.start()	

		const sp = new egret.Sprite()
		sp.graphics.beginFill(0x000000)
		sp.graphics.drawRect(0,0,img.width, img.height)
		sp.graphics.endFill()
		t.addChild(sp)

		const ct = new egret.Sprite()
		t.addChild(ct)
		ct.addChild(img)

		const white = new egret.Shape()
		white.graphics.beginFill(0xFFFFFF, 0.8)
		white.graphics.drawRect(0,0,img.width, img.height)
		white.graphics.endFill()
		white.visible = false
		t.addChild(white)

		t._shp = sp
		t._img = img
		t._imgContainer = ct
		// t._particle = ptc
		t._white = white
		
	}

	public refresh(){
		const t = this
		if(!t.activate || t._hp<=0) return
		
		t._curMoveCounter --
		if(t._curMoveCounter <= 0){
			t._curMoveCounter = t._maxMoveCounter
			t._dRotation = - 90 + Math.floor(Math.random()*30) - 15
		}
		
		if(t._dRotation != t.rotation){
			t.rotation += t._dRotation>t.rotation?1:-1
			t.moveData.setData(t.rotation, t._speed)
		}

		const {dx, dy} = t.moveData.getDAxis()
		//test
		t.x += dx
		t.y += dy

		if(t._white.visible){
			t._whiteCounter --
			if(t._whiteCounter <= 0) t._white.visible = false
		}
		
		if(t.x < -200 ){
			t.dispose()
		}else{
			super.refresh()	
		}
		
	}

	public dispose(){
		const t = this
		t._white.visible = true
		setTimeout(()=>{
			if(t._hpreset || t._hp == 0) t._hp = t._maxhp
			t.moveData.setData(-90, t._speed)
			t._white.visible = false
			t.parent && t.parent.removeChild(t)
			t.activate = false		
		},250)
		
		
	}

	public hit(b:Bullet){
		const t = this
		t.hp -= b.damage
		if(!t._white.visible)t._white.visible = true
		t._whiteCounter = 6
		
		if(t._hp<=0){
			//test
			t.dispose()
			return true
		}
		return false
		
	}

	public set hp(v:number){
		v = v<0?0:v
		this._hp = v
		if(v == 0) this.dispatchEvent(new egret.Event(GameEvents.FISH_HUNTED))
	}

	public get hp(){
		return this._hp
	}

	public get score(){
		return this._score
	}

	public get collisionSp(){
		return this._shp
	}

	/**出现率 */
	public get rate(){
		return this._rate
	}

	public get type(){
		return this._type
	}

	/**是否处于无敌 */
	public get invisible(){
		return this._white.visible
	}

	public get img(){
		return this._img
	}
}


interface IFishRawData{
	type:number, rate:number,
	speed:number, hp:number, score:number, size:number ,
	imgUrl:string, filterFunc?:()=>egret.Filter, 
	/**重新出现时hp不加满的概率 */
	hpNotReset:number
}
