var Imba = require('imba');
function BasicValidator(field,condition){
	this._field = field;
	this._condition = condition;
};

BasicValidator.prototype.object = function(v){ return this._object; }
BasicValidator.prototype.setObject = function(v){ this._object = v; return this; };
BasicValidator.prototype.field = function(v){ return this._field; }
BasicValidator.prototype.setField = function(v){ this._field = v; return this; };
BasicValidator.prototype.condition = function(v){ return this._condition; }
BasicValidator.prototype.setCondition = function(v){ this._condition = v; return this; };
BasicValidator.prototype.value = function(v){ return this._value; }
BasicValidator.prototype.setValue = function(v){ this._value = v; return this; };

BasicValidator.prototype.run = function (thing){
	var errors_, v_;
	this._object = thing;
	(errors_ = this._object.errors()) || ((this._object.setErrors(v_ = []),v_));
	return this._value = this._object[this.field()]();
};

BasicValidator.prototype.add = function (message){
	if (message) { return this._object.errors().push(message) };
};


function PresenceValidator(){ return BasicValidator.apply(this,arguments) };

Imba.subclass(PresenceValidator,BasicValidator);
exports.PresenceValidator = PresenceValidator; // export class 
PresenceValidator.prototype.run = function (object){
	PresenceValidator.prototype.__super__.run.apply(this,arguments);
	return this.add(
		this.condition() ? (
			(!(this.value())) && (("" + this.field() + " is missing"))
		) : (
			this.value() && (("" + this.field() + " is present"))
		)
	);
};

function InclusionValidator(){ return BasicValidator.apply(this,arguments) };

Imba.subclass(InclusionValidator,BasicValidator);
exports.InclusionValidator = InclusionValidator; // export class 
InclusionValidator.prototype.run = function (object){
	InclusionValidator.prototype.__super__.run.apply(this,arguments);
	return this.add(
		(this.condition() && (this.condition() instanceof Array)) ? (
			(Imba.indexOf(this.value(),this.condition()) == -1) && (
				("" + this.field() + " should be one of " + this.condition())
			)
		) : (
			"inclusion validation requires an array"
		)
	);
};

function NumericalityValidator(){ return BasicValidator.apply(this,arguments) };

Imba.subclass(NumericalityValidator,BasicValidator);
exports.NumericalityValidator = NumericalityValidator; // export class 
NumericalityValidator.prototype.run = function (object){
	NumericalityValidator.prototype.__super__.run.apply(this,arguments);
	const allowed = ['is','greater_than','less_than','in'];
	this.add(
		(this.condition() && Imba.indexOf(Object.keys(this.condition())[0],allowed) == -1) ? (
			("numericality validation requires one of " + allowed.join(', '))
		) : ((this.condition().is && (this.value() !== this.condition().is)) ? (
			("" + this.field() + " must be exactly " + (this.condition().is))
		) : ((this.condition().greater_than && (this.value() <= this.condition().greater_than)) ? (
			("" + this.field() + " must be greater than " + (this.condition().greater_than))
		) : ((this.condition().less_than && (this.value() >= this.condition().less_than)) ? (
			("" + this.field() + " must be less than " + (this.condition().less_than))
		) : ((this.condition().in && (this.value() < this.condition().in[0] || this.value() > this.condition().in[1])) && (
			("" + this.field() + " must be between " + (this.condition().in[0]) + " and " + (this.condition().in[1]))
		)))))
	);
	
	return this.add(
		(this.condition().integer && ("" + this.value()).split('.').length > 1) && (
			("" + this.field() + " must be an integer")
		)
	);
};

function PatternValidator(){ return BasicValidator.apply(this,arguments) };

Imba.subclass(PatternValidator,BasicValidator);
exports.PatternValidator = PatternValidator; // export class 
PatternValidator.prototype.run = function (object){
	PatternValidator.prototype.__super__.run.apply(this,arguments);
	return this.add(
		(this.condition() && (this.condition() instanceof RegExp)) ? (
			(!this.condition().test(this.value())) && (
				("" + this.field() + " must match the pattern of " + this.condition())
			)
		) : (
			"pattern validation requires a regular expression"
		)
	);
};

function LengthValidator(){ return BasicValidator.apply(this,arguments) };

Imba.subclass(LengthValidator,BasicValidator);
exports.LengthValidator = LengthValidator; // export class 
LengthValidator.prototype.run = function (object){
	LengthValidator.prototype.__super__.run.apply(this,arguments);
	const allowed = ['min','max','is','in'];
	const len = this.value().length;
	return this.add(
		(this.condition() && Imba.indexOf(Object.keys(this.condition())[0],allowed) == -1) ? (
			("length validation requires one of " + allowed.join(', '))
		) : ((this.condition().min && (len < this.condition().min)) ? (
			("" + this.field() + " must be at least " + (this.condition().min))
		) : ((this.condition().max && (len > this.condition().max)) ? (
			("" + this.field() + " must be at most " + (this.condition().max))
		) : ((this.condition().is && (len !== this.condition().is)) ? (
			("" + this.field() + " must be exactly " + (this.condition().is))
		) : ((this.condition().in && (len < this.condition().in[0] || len > this.condition().in[1])) && (
			("" + this.field() + " must be between " + (this.condition().in[0]) + " and " + (this.condition().in[1]))
		)))))
	);
};