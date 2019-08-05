import { 
	PresenceValidator, 
	InclusionValidator, 
	NumericalityValidator, 
	PatternValidator, 
	LengthValidator } from './validators'

export tag ActiveTag
	prop errors
	
	VALIDATORS = {
		'presence': do |field, condition|
			PresenceValidator.new(field, condition)
		'in': do |field, condition|
			InclusionValidator.new(field, condition)
		'length': do |field, condition|
			LengthValidator.new(field, condition)
		'numericality': do |field, condition|
			NumericalityValidator.new(field, condition)
		'pattern': do |field, condition|
			PatternValidator.new(field, condition)
	}
	
	def self.validates hash
		self:validators ||= []
		for field, validations of hash
			for validator, condition of validations
				self:validators.push VALIDATORS[validator](field, condition)
			
	def validate
		errors = {}
		for validator in self:constructor:validators
			validator.run(self)
			
	def isValid
		validate
		Object.keys(errors):length == 0