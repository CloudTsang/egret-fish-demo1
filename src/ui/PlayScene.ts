class PlayScene extends eui.Component{
	protected _score:number
	protected canon:Canon
	protected spWeapon:SpWeapon
	protected spIndex:number

	protected sppanel:SpWeaponPanel
	protected area:eui.Component
	protected txtScore:eui.Label
	protected layer:eui.Group

	protected spGauge:SpGauge
	protected touchDownY:number

	protected maxFish:number = 30
	protected spChooseCounter:number
	protected maxSpChooseCounter:number = 1000

	protected collisionCheckCounter:number
	protected maxCollisionCheckCounter:number = 1

	public constructor() {
		super()
		this.skinName = "resource/eui_skins/skin/PlayScene.exml"
		this.touchEnabled = true
		this.touchChildren = true
		this._score = 0
		
		this.once(eui.UIEvent.CREATION_COMPLETE, this.onComplete, this)
	}

	protected onComplete(e:any){
		const t = this
		t.collisionCheckCounter = t.maxCollisionCheckCounter
		t.spChooseCounter = t.maxSpChooseCounter
		t.area.addEventListener(egret.TouchEvent.TOUCH_BEGIN, t.onTouchDown, t)
		// t.area.addEventListener(egret.TouchEvent.TOUCH_CANCEL, t.onTouchUp, t)
		t.area.addEventListener(egret.TouchEvent.TOUCH_END, t.onTouchUp, t)
		t.area.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, t.onTouchUp, t)
		t.area.addEventListener(egret.TouchEvent.TOUCH_MOVE, t.onTouchMove, t)
		t.sppanel.addEventListener(GameEvents.SP_CHOSEN, t.onSpChosen, t)
		

		t.canon.x = (t.stage.stageWidth - t.canon.width)/2
		t.canon.y = t.stage.stageHeight - (t.canon.height - t.canon.anchorOffsetY)

		t.addEventListener(egret.Event.ENTER_FRAME, t.refresh, t)
		t.sppanel.pState = WeaponState.NULL
		t.spIndex = 0

		//test 
		t.sppanel.pState = WeaponState.NORMAL
		const f = FishPool.instance.getOne()
		f.x = 500
		f.y = 300
		t.addChild(f)

		// const f2 = FishPool.instance.getOne()
		// f2.x = 1000
		// f2.y = 500
		// t.addChild(f2)
	}

	protected refresh(e:any){
		const t = this

		t.canon.refresh()	

		for(let b of Bullet.allArr){
			if(b.activate) b.refresh()
		}

		let fishNum = 0
		for(let f of FishPool.instance.arr){
			if(f.activate){
				fishNum ++
				
				f.refresh()
				f.refreshCollisionPoints()
			} 
		}

		if(t.spWeapon){
			t.spWeapon.timePassed()
			t.spGauge && t.spGauge.refresh()
		}

		t.collisionCheckCounter --
		if(t.collisionCheckCounter <= 0){
			t.collisionCheckCounter = t.maxCollisionCheckCounter
			for(let f of FishPool.instance.arr){
				if(!f.activate || f.invisible) continue
				let hunted:boolean = false
				for(let b of Bullet.allArr){
					if(!b.activate) continue
					
					const hit = b.collisionCheck(f)
					if(!hit) continue
					b.dispose()
					hunted = f.hit(b)
					if(hunted) break
				}
				if(hunted){
					t.addScore(f.score)
					continue
				}
				if(!f.activate || f.invisible) continue
				if(t.spWeapon){
					const hit = t.spWeapon.collisionCheck(f)
					if(hit){
						hunted = f.hit(t.spWeapon)
					}
				}
				if(hunted){
					t.addScore(f.score)
					continue
				}
			}
		}
		
		//test
		if(fishNum < t.maxFish){
			const r = Math.random()
			if(r < 0.2){
				const f = FishPool.instance.getOne()
				f.x = t.width + 100
				f.y = Math.floor(Math.random()*300)+200
				t.addChild(f)
				f.img.cacheAsBitmap = true
				// f.cacheAsBitmap = true
			}
		}
	}

	protected onTouchDown(e:egret.TouchEvent){
		const t = this
		t.onTouchMove(e)
		t.touchDownY = e.stageY
		t.canon.fire()
	}

	protected onTouchUp(e:egret.TouchEvent){
		const t = this
		if(!t.canon.isStartFireing && t.spWeapon){
			const tmpy = e.stageY
			if(t.touchDownY - tmpy >= 200){
				t.spWeapon.shot()
			}
		}
		t.canon.ceaseFire()
		
	}

	protected onTouchMove(e:egret.TouchEvent){
		const t = this
		const mouseX = e.stageX
		const mouseY = e.stageY
		const tan = (mouseX - t.canon.x)/(mouseY - t.canon.y)
		const deg = Math.atan(tan)*180/Math.PI
		t.canon.rotation = -deg
	}

	protected onSpChosen(e:egret.Event){
		const t = this
		t.sppanel.pState = e.data.type
		let gauge:egret.DisplayObject
		switch(e.data.type){
			case WeaponState.LASER:
				t.spWeapon =  new Laser(t.canon, t.spIndex)
				gauge = t.sppanel.gaugeLaser
				break
			case WeaponState.MISSLE:
				t.spWeapon =  new MissleLauncher(t.canon, t.spIndex)
				gauge = t.sppanel.gaugeMissle
				break
			case WeaponState.YOYO:
				t.spWeapon =  new Yoyo(t.canon, t.spIndex)
				gauge = t.sppanel.gaugeYoyo
				break
			default:
				return 
		}
		t.spIndex++
		t.spWeapon.once(GameEvents.SP_OVER, t.onSpOver, t)
		t.spGauge = new SpGauge(t.spWeapon, gauge, gauge.width/2)
	}

	protected onSpOver(e:egret.Event){
		const t = this
		const sp = (e.currentTarget as SpWeapon)
		sp.dispose()
		if(sp.index == t.spIndex){
			t.sppanel.pState = WeaponState.NULL
			t.spGauge && t.spGauge.dispose()
			t.spGauge = null
			t.spWeapon = null
		}
		
	}

	public addChild(child: egret.DisplayObject): egret.DisplayObject{
		return this.layer.addChild(child)
	}

	public addScore(v:number){
		const t = this
		t.spChooseCounter -= v
		if(t.spChooseCounter <= 0){
			t.spChooseCounter = t.maxSpChooseCounter
			t.sppanel.pState = WeaponState.NORMAL
			t.spGauge && t.spGauge.dispose()
			t.spGauge = null
		}
		t._score += v
		t.txtScore.text = ''+t._score
	}
}