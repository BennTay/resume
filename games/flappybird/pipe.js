class Pipe {
	constructor(w, ch, x, s, gh, topImg, bottomImg) {
		this.w = w; // width
		this.ch = ch; // canvas height
		this.x = x; // x position
		this.s = s; // speed
		this.gh = gh; // gap height
		this.gp = random(30, 350); // gap position

		// Generate top and bottom components
		this.topHeight = this.gp;
		this.bottomYPos = this.gp + 120;
		this.bottomHeight = this.ch - this.gh - this.topHeight;

		// Images
		this.topComponentImg = topImg;
		this.bottomComponentImg = bottomImg;
	}
/*
	set topPipeImg(img) {
		Pipe.topComponentImg = img;
	}
	set bottomPipeImg(img) {
		Pipe.bottomComponentImg = img;
	}
*/
	get bottomComponentHeight() {
		return this.bottomHeight;
	}

	get topComponentHeight() {
		return this.topHeight;
	}

	get bottomComponentYPos() {
		return this.bottomYPos;
	}

	get xPos() {
		return this.x;
	}
	set xPos(x) {
		this.x = x
	}

	get speed() {
		return this.s;
	}
	set speed(s) {
		this.s = s;
	}

	draw() {
		// Top component
		//rect(this.x, 0, this.w, this.topHeight);
		image(this.topComponentImg, this.x, 0, this.w, this.topHeight);

		// Bottom component
		//rect(this.x, this.bottomYPos, this.w, this.bottomHeight);
		image(this.bottomComponentImg, this.x, this.bottomYPos, this.w, this.bottomHeight);
	}
}