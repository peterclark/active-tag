function iter$(a){ return a ? (a.toArray ? a.toArray() : a) : []; };
var Imba = require('imba');
var validators$ = require('./validators'), PresenceValidator = validators$.PresenceValidator, InclusionValidator = validators$.InclusionValidator, NumericalityValidator = validators$.NumericalityValidator, PatternValidator = validators$.PatternValidator, LengthValidator = validators$.LengthValidator;

var ActiveTag = Imba.defineTag('ActiveTag', function(tag){
	tag.prototype.errors = function(v){ return this._errors; }
	tag.prototype.setErrors = function(v){ this._errors = v; return this; };
	
	VALIDATORS = {
		'presence': function(field,condition) {
			return new PresenceValidator(field,condition);
		},
		'in': function(field,condition) {
			return new InclusionValidator(field,condition);
		},
		'length': function(field,condition) {
			return new LengthValidator(field,condition);
		},
		'numericality': function(field,condition) {
			return new NumericalityValidator(field,condition);
		},
		'pattern': function(field,condition) {
			return new PatternValidator(field,condition);
		}
	};
	
	tag.validates = function (hash){
		this.validators || (this.validators = []);
		let res = [];
		for (let field in hash){
			let validations;
			validations = hash[field];let res1 = [];
			for (let validator in validations){
				let condition;
				condition = validations[validator];res1.push(this.validators.push(VALIDATORS[validator](field,condition)));
			};
			res.push(res1);
		};
		return res;
	};
	
	tag.prototype.validate = function (){
		this.setErrors([]);
		let res = [];
		for (let i = 0, items = iter$(this.constructor.validators), len = items.length; i < len; i++) {
			res.push(items[i].run(this));
		};
		return res;
	};
	
	tag.prototype.isValid = function (){
		this.validate();
		return this.errors().length == 0;
	};
})
exports.ActiveTag = ActiveTag;
