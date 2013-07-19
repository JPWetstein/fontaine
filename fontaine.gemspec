# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'fontaine/version'
require 'fontaine/canvas'

Gem::Specification.new do |spec|
  spec.name          = "fontaine"
  spec.version       = Fontaine::VERSION
  spec.authors       = ["J. Paul Wetstein"]
  spec.email         = ["Jeep.Wetstein@gmail.com"]
  spec.description   = %q{Gem to help with HTML5 canvas}
  spec.summary       = %q{Gem to help with HTML5 canvas}
  spec.homepage      = ""
  spec.license       = "MIT"

  spec.files         = `git ls-files`.split($/)
  spec.executables   = spec.files.grep(%r{^bin/}) { |f| File.basename(f) }
  spec.test_files    = spec.files.grep(%r{^(test|spec|features)/})
  spec.require_paths = ["lib"]
  
  spec.add_dependency 'sinatra-websocket', '~>0.2.0'

  spec.add_development_dependency "bundler", "~> 1.3"
  spec.add_development_dependency "rake"
  
end
