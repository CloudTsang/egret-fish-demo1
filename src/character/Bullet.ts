class Bullet extends BaseCharacter implements IPoolObject{
	public activate:boolean = false;	
	protected _damage:number
	protected size:number
	protected _sp:egret.DisplayObject
	protected _stage = egret.MainContext.instance.stage
	public constructor() {
		super()
		this.moveData = new MoveData()
		this.moveData.setData(0, 50)
		this._damage = 1
		this.size = 30
		this.draw()
	}

	protected draw(){
		const size = this.size
		let sp = new egret.Bitmap(RES.getRes("bullet_png"))	
		const scale = sp.width/sp.height
		sp.width = size
		sp.height = sp.width/scale	
		sp.x = -size/2
		sp.y = -size/2
		this.addChild(sp)
		this._sp = sp;	
		this._sp.visible = true;	
	}	

	public shot(tgtx:number=0, tgty:number=0){
		this.activate = true
	}

	public setDirection(rot:number=0, spd=-1){
		if(spd == -1) spd = this.moveData.speed
		this.moveData.setData(rot,spd)
		this.rotation = rot
	}

	public refresh(){		
		const b = this
		if(!b.activate) return
		const {dx, dy} = b.moveData.getDAxis()
		b.x += dx
		b.y += dy

		if(b.y < -100 || b.x < -100 || b.y > b._stage.stageHeight || b.x > b._stage.stageWidth){
			b.dispose()
		}else{
			super.refresh()
		}
	}

	public collisionCheck(obj:Fish){
		const t = this
		if(!t.position) return false
		const d = egret.Point.distance(obj.position, t.position)
		if(d > 200) return false
		return obj.collisionSp.hitTestPoint(t.position.x, t.position.y)
	}

	public dispose(shouldBlast:boolean=true){		
		// console.log("dispose")
		this.activate = false;
		this.parent && this.parent.removeChild(this);				
	}

	public get damage(){
		return this._damage
	}

	public static allArr:Bullet[] = []
	public static pool:Pool<Bullet> = new Pool<Bullet>(()=>{
		let b = new Bullet()
		Bullet.allArr.push(b)
		return b
	})

}