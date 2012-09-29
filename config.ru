$:.unshift('.')

require 'lib/database'
require 'lib/validator_proxy'
require 'lib/validator_frontend'

require 'rack/builder'

app = Rack::Builder.new do
  map '/proxy' do
    run ValidatorProxy.new
  end

  map '/zkir' do
    run ValidatorFrontend.new( DB[:map_errors].filter(:source => 'zkir') )
  end

  map '/cupivan_places' do
    run ValidatorFrontend.new( DB[:map_errors].filter(:source => 'cupivan_places') )
  end

  map '/poi' do
    run ValidatorFrontend.new( DB[:map_errors].filter(:source => 'pois') )
  end

  run lambda { |env| [200, {'Content-Type' => 'text/plain'}, ['OK']] }
end

run app
