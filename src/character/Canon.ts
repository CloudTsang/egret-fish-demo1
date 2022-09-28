class Canon extends eui.Image{
	private _isFire:boolean
	private _fireSpan:number[]
	private _fireSpanIndex:number
	private _curFireCounter:number

	public constructor() {
		super()
		const t = this
		const fps:number = egret.MainContext.instance.stage.frameRate
		t._fireSpan = [0.8*fps, 0.7*fps, 0.6*fps, 0.5*fps, 0.4*fps ,0.3*fps, 0.2*fps]
		t._fireSpanIndex = 0
		t._curFireCounter = t._fireSpan[t._fireSpanIndex]
		// t.alpha = 0
	}

	public refresh(){
		const t = this
		if(t._isFire){
			t._curFireCounter --
			if(t._curFireCounter <= 0){
				t.fireHandler()
				if(t._fireSpanIndex < t._fireSpan.length - 1){
					t._fireSpanIndex ++
				}
				t._curFireCounter = t._fireSpan[t._fireSpanIndex]
			}	
		}
	}

	public fire(){
		this._isFire = true
		// this.fireHandler()
	}

	public ceaseFire(){
		const t = this
		t._isFire = false
		t._fireSpanIndex = 0
		t._curFireCounter = t._fireSpan[t._fireSpanIndex]
	}

	protected fireHandler(){
		const t = this
		const b = Bullet.pool.getOne()
		// console.log("fire")
		b.setDirection(t.rotation)
		b.x = t.x + (Math.random() * 40 - 20)
		b.y = t.y
		t.parent.addChild(b)
		b.shot()
		SoundManager.instance().playBgs("bullet_mp3")
		return b
	}

	public get isStartFireing(){
		return this._fireSpanIndex > 0
	}
}