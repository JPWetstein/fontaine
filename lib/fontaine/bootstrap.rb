module Sinatra
  module Fontaine
    module Bootstrap

      module Assets

        ASSETS = {
          :js => [
            'fontaine.js'
          ],
        }
        
        def self.generate_bootstrap_asset_routes(app)
          ASSETS.each do |kind, files|
            files.each do |file|
              name = file
              
              app.get "/#{kind.to_s}/#{name}", :provides => kind do
                File.read(File.join(File.dirname(__FILE__), 'assets', name))
              end
            end
          end
        end
    
        def self.registered(app)
          generate_bootstrap_asset_routes(app)
          app.helpers AssetsHelper
        end
        
      end
      
      module AssetsHelper
        
        def bootstrap_fontaine
          bootstrap_js
        end
        
        def bootstrap_js
          output = ''
          Assets::ASSETS[:js].each do |file, _|
            output += '<script type="text/javascript" src="%s"></script>' % url('/js/%s' % file)
          end
          output
        end
      end
    end
  end
end