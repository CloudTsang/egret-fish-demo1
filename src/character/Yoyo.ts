class Yoyo extends SpWeapon{
	private _line:egret.Shape
	private _aniTime:number
	/**动画阶段， 1=放出，2=停留，3=返回，4=结束 */
	private _phrase:number 
	private _stayTime:number
	private _backTw:egret.Tween
	private _tmpX:number
	private _tmpY:number
	private _shouldDispose:boolean
	private _r:number
	public constructor(canon:Canon, index:number) {
		super(15, SpWeaponTimesUnit.TIME, canon, index)
		this._stayTime = egret.MainContext.instance.stage.frameRate*3
		this._tmpX = -1
		this._tmpY = -1
		this._phrase = 4
	}

	public timePassed(){
		const t = this
		
		if(t._sp && t._phrase != 4) {
			t._sp.rotation += 8
			if(t._aniTime > 0){
				switch(t._phrase){
					case 1:
						//放出铁球
						const {dx, dy} = t.moveData.getDAxis()
						t._sp.x += dx
						t._sp.y += dy
						t._line.graphics.lineTo(t._sp.x, t._sp.y)
						t._aniTime -- 
						t.position = new egret.Point(t._sp.x, t._sp.y)
						break
					case 2:
						//铁球停留
						t._aniTime --
						break
				}
			}else if(t._aniTime == 0){
				switch(t._phrase){
					case 1:
						//铁球到达位置
						if(t._tmpX!=-1 && t._tmpY !=-1){
							//已进行下一次射击操作，马上返回
						}else{					
							t._aniTime = t._stayTime
						}
						t.position = new egret.Point(t._sp.x, t._sp.y)
						t._phrase = 2
						break
					case 2:
						//收回铁球
						t._phrase = 3
						SoundManager.instance().playBgs('yoyo_mp3')
						t._backTw = egret.Tween.get(t)
						.to({
							spX:t._canon.x,
							spY:t._canon.y,
							refreshLine:1
						}, 500)
						.call(()=>{
							t._phrase = 4
							if(t._shouldDispose){
								t.dispose()
								return
							}
							if(t._tmpX!=-1 && t._tmpY !=-1){
								t.shot(t._tmpX, t._tmpY)
							}else{
								t._sp.parent && t._sp.parent.removeChild(t._sp)
							}	
						})
						break
				}
			}
		}
		super.timePassed()
	}

	public shot(tgtx:number=0, tgty:number=0){
		const t = this
		if(t._phrase!=4){
			if(t._phrase == 2) t._aniTime = 0
			t._tmpX = tgtx
			t._tmpY = tgty
			return
		}
		if(!t._sp.parent) {
			t._canon.parent.addChildAt(t._sp, 1)
			t._canon.parent.addChildAt(t._line, 1)
		}
		t._sp.x = t._canon.x
		t._sp.y = t._canon.y
		t._line.graphics.moveTo(t._sp.x, t._sp.y)

		let d = egret.MainContext.instance.stage.stageHeight * 0.8
		const spd = 30
		if(Math.abs(t._canon.rotation) > 45) d = egret.MainContext.instance.stage.stageHeight
		t._aniTime = Math.round(d/spd)
		t.moveData.setData(t._canon.rotation,spd)
		t._phrase = 1
		t._tmpX = -1
		t._tmpY = -1
		SoundManager.instance().playBgs('yoyo_mp3')
	}

	public dispose(){
		const t = this
		if(t._phrase != 4){
			t._shouldDispose = true
			if(!t._backTw){
				t._backTw = egret.Tween.get(t._sp)
				.to({
					x:t._canon.x,
					y:t._canon.y
				}, 500)
				.call(()=>{
					t._phrase = 4
					t.dispose()
				})
			}
			return
		}
		t._sp.parent && t._sp.parent.removeChild(t._sp)
		t.parent && t.parent.removeChild(t)
	}

	public collisionCheck(f:Fish){
		const t = this
		const should = t.shouldCollisionCheck
		if(!should) return false
		if(!t._sp)return false
		if(t._phrase == 4 || t._phrase == 3) return false
		
		
		const d = egret.Point.distance(t.position, f.position)
		if(d < t._r) return true
		
	}

	protected draw(){
		const sp = new egret.Bitmap(RES.getRes('yoyop_png'))
		sp.anchorOffsetX = sp.width/2
		sp.anchorOffsetY = sp.height/2
		sp.scaleX = 3
		sp.scaleY = 3
		this._sp = sp
		this._r = sp.width * sp.scaleX/2

		const line = new egret.Shape()
		line.graphics.lineStyle(6, 0x000000)
		this._line = line
	}

	public set spX(v:number){
		this._sp.x = v
	}
	public set spY(v:number){
		this._sp.y = v
	}
	public get spX(){
		return this._sp.x
	}
	public get spY(){
		return this._sp.y
	}

	public set refreshLine(v:number){
		const t = this
		t._line.graphics.clear()
		t._line.graphics.lineStyle(6, 0x000000)
		t._line.graphics.moveTo(t._canon.x, t._canon.y)
		t._line.graphics.lineTo(t._sp.x, t._sp.y)
	}
	public get refreshLine(){
		return 0
	}

}