class BasicValidator
	prop object
	prop field
	prop condition
	prop value
	
	def initialize field, condition
		@field = field
		@condition = condition
		
	def run thing
		@object = thing
		@object.errors ||= {}
		@value = @object[field]()
		
	def add field, message
		if message
			@object.errors[field] ||= []
			@object.errors[field].push message
		
	
export class PresenceValidator < BasicValidator
	# validates word: { presence: true }
	# validates word: { presence: false }
		
	def run object
		super
		add field,
			if condition
				"{field} is missing" if !value
			else
				"{field} is present" if value
		
export class InclusionValidator < BasicValidator
	# validates word: { in: ['red', 'blue'] }
		
	def run object
		super
		add field,
			if condition && condition isa Array
				if value not in condition
					"{field} should be one of {condition}"
			else
				"inclusion validation requires an array"
				
export class NumericalityValidator < BasicValidator
	# validates height: { is: 9.5 }
	# validates height: { is: 10, integer: true }
	# validates height: { greater_than: 10 }
	# validates height: { less_than: 10 }
	# validates height: { in: [8,12]
	
	def run object
		super
		const allowed = ['is', 'greater_than', 'less_than', 'in']
		add field,
			if condition && Object.keys(condition)[0] not in allowed
				"numericality validation requires one of {allowed.join(', ')}"
			else if condition:is && (value isnt condition:is)
				"{field} must be exactly {condition:is}"
			else if condition:greater_than && (value <= condition:greater_than)
				"{field} must be greater than {condition:greater_than}"
			else if condition:less_than && (value >= condition:less_than)
				"{field} must be less than {condition:less_than}"
			else if condition:in && (value < condition:in[0] || value > condition:in[1])
				"{field} must be between {condition:in[0]} and {condition:in[1]}"
				
		add field,
			if condition:integer && "{value}".split('.'):length > 1
				"{field} must be an integer"
			
export class PatternValidator < BasicValidator
	# validates word: { pattern: /^[A-Z]\d{5}$/ }
	
	def run object
		super
		add field,
			if condition && condition isa RegExp
				if not condition.test(value)
					"{field} must match the pattern of {condition}"
			else
				"pattern validation requires a regular expression"
			
export class LengthValidator < BasicValidator
	# validates word: { length: { is: 10 }}
	# validates word: { length: { min: 10 }}
	# validates word: { length: { max: 10 }}
	# validates word: { length: { in: [1,10] }}
		
	def run object
		super
		const allowed = ['min', 'max', 'is', 'in']
		const len = value:length
		add field,
			if condition && Object.keys(condition)[0] not in allowed
				"length validation requires one of {allowed.join(', ')}"
			else if condition:min && (len < condition:min)
				"{field} must be at least {condition:min}"
			else if condition:max && (len > condition:max)
				"{field} must be at most {condition:max}"
			else if condition:is && (len isnt condition:is)
				"{field} must be exactly {condition:is}"
			else if condition:in && (len < condition:in[0] || len > condition:in[1])
				"{field} must be between {condition:in[0]} and {condition:in[1]}"
				