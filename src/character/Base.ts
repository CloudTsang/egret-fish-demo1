class BaseCharacter extends egret.Sprite{
	protected moveData:MoveData
	public position:egret.Point
	protected _collisionPoints:egret.Point[]
	/**上次更新碰撞点的位置点，对比位置点相同时不更新碰撞点 */
	protected _lastCollisionRefreshPoint:egret.Point = null
	public collisionPoints:egret.Point[]
	public constructor() {
		super()
	}

	protected draw(){

	}

	public refresh(){
		this.position = new egret.Point(this.x, this.y)
		// this.refreshCollisionPoints()
	}

	public dispose(){

	}

	public refreshCollisionPoints(){
		const t = this
		if(t._collisionPoints && t._lastCollisionRefreshPoint != t.position){
			t.collisionPoints = t._collisionPoints.map((p, i)=>{
				if(!t.parent) return p
				return t.localToGlobal(p.x, p.y)
			});
			t._lastCollisionRefreshPoint = t.position
		}
		
	}
}