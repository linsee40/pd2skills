/**
 * Composite
 */
function Composite() {
	if ( ! this instanceof Composite) return new Composite;
	this.childList = [];
}

Composite.fn = Composite.prototype;

// ================================================================
// = Methods
// ================================================================

Composite.fn.addChild = function(element) {
	this.childList.push(element);
}

Composite.fn.getChild = function(index) {
	return this.childList[index];
}

Composite.fn.loopChild = function(callable, thisArg) {
	return this.childList.map(callable, thisArg);
}


// ================================================================
// = Extend
// ================================================================

Composite.fn.addChilds = function(childs) {
	if ( ! (childs instanceof Array)) return;

	childs.forEach(function(child) {
		this.addChild(this.initChild(child));
	}, this);
}

Composite.fn.initChild = function(child) {
	return child;
}