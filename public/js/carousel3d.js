var transformProp = Modernizr.prefixed('transform');
function Carousel3D ( el ) {
	this.element = el;

	this.rotation = 0;
	this.panelCount = 0;
	this.totalPanelCount = this.element.children.length;
	this.theta = 0;

	this.isHorizontal = true;

}

Carousel3D.prototype.modify = function() {

	var panel, angle, i;

	this.panelSize = this.element[ this.isHorizontal ? 'offsetWidth' : 'offsetHeight' ];
	this.rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';
	this.theta = 360 / this.panelCount;

	// do some trig to figure out how big the carousel
	// is in 3D space
	this.radius = Math.round( ( this.panelSize / 2) / Math.tan( Math.PI / this.panelCount ) );

	for ( i = 0; i < this.panelCount; i++ ) {
		panel = this.element.children[i];
		angle = this.theta * i;
		panel.style.opacity = 0.8;
		panel.style.backgroundColor = 'hsla(' + angle + ', 100%, 50%, 0.8)';
		// rotate panel, then push it out in 3D space
		panel.style[ transformProp ] = this.rotateFn + '(' + angle + 'deg) translateZ(' + this.radius + 'px)';
	}

	// hide other panels
	for (  ; i < this.totalPanelCount; i++ ) {
		panel = this.element.children[i];
		panel.style.opacity = 0;
		panel.style[ transformProp ] = 'none';
	}

	// adjust rotation so panels are always flat
	this.rotation = Math.round( this.rotation / this.theta ) * this.theta;

	this.transform();

};

Carousel3D.prototype.transform = function() {
  // push the carousel back in 3D space,
  // and rotate it
  this.element.style[ transformProp ] = 'translateZ(-' + this.radius + 'px) ' + this.rotateFn + '(' + this.rotation + 'deg)';
};