# Fontaine

A bridge between Ruby and HTML5 canvas **for Sinatra** using Websocket. Basically, this allows you to make <canvas> based
apps in Ruby. 

## Installation

Add this line to your application's Gemfile:

    gem 'fontaine'

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install fontaine

## Usage

Just put this in your pipe:

	require 'sinatra/base'
	require 'fontaine/canvas' #the meat of everything canvas-related
	require 'fontaine/bootstrap' 
	require 'sinatra-websocket'
	require 'haml' #not strictly necessary, but recommended
	
	class Sample < Sinatra::Base
	  register Sinatra::Fontaine::Bootstrap::Assets
	  set :server, 'thin'
	  set :sockets, []
	  
	  get '/' do
	    
	    @canvas = Fontaine::Canvas.new("TEST_CANVAS", 500, 500, "Your browser does not support the canvas tag", 
	      :style => "border:1px solid #000000;") do |canvas|
	        
	        canvas.on_click do |x, y, button| #when there's a click, do this:
	          canvas.rect(x.to_i-25, y.to_i-25, 50, 50)
	          
	          if button.eql? '0' #left click will give you a solid red rectangle
	            canvas.fill_style("#FF0000")
	            canvas.fill
	          else #right click will give you the outline of a blue rectangle
	            canvas.stroke_style("blue")
	            canvas.stroke
	          end
	          
	        end
	    end
	    
	    if request.websocket?
	      @canvas.listen(request, settings)
	    else
	      haml :index
	     
	    end
	  end
	  
	end

## views/index.haml	

	%script{:src => "/javascripts/jquery-1.9.1.js", :type => "text/javascript"}
	= bootstrap_fontaine
	= @canvas.display
	
## sample_config.ru

	require './sample'
	run Sample
	
and smoke it! (After you've put jquery-1.9.1.js into /public/javascripts/)

    rackup sample_config.ru

Ok, that's pretty complicated. Let me give you some further explanations. We'll start with  
making a new Canvas:

    Fontaine::Canvas.new("TEST_CANVAS", 500, 500, "Your browser does not support the canvas tag", 
      :style => "border:1px solid #000000;")
      
This is pretty simple. The first parameter is simply the id of the canvas you will be displaying. The second
and third parameters are the width and height of the canvas. The fourth is the alt text if the user's browser 
doesn't support <canvas>. Finally, the fifth parameter is a hash of any other html options you 
wish to add to the canvas. In this case, I'm giving it a border.

Next, while initializing, you can give it a block of code to execute when the user takes actions related to the canvas.
(Note, you can do this at any point once the canvas is initialized by passing a block to any of the action methods). 
The block will be whatever code you want to run in response to those actions. In addition, each action is yielded 
a few parameters from the javascript event call. For more information on specific actions available and their parameters, see 
the **Action Methods** section.

That's only half the story, though. You've got to be able to draw on the canvas! You can use any of the methods from 
[here](http://www.w3schools.com/tags/ref_canvas.asp) and they will work pretty much how you'd expect, with a couple 
exceptions (see **Exceptions and Issues**). Most of the time, you simply can directly use a 'rubyfied' version of the same
method. For example, instead of calling @canvas.fillRect(), you call @canvas.fill_rect. The other major exception is that rather
than setting canvas attributes with '=', you'll simply use a method of the same name (canvas.fill_style("#FF0000"), 
not canvas.fill_style = "#FF0000")

Alright, so you've got your action methods set up and you know how to draw on the canvas, you just have to get it going. In the
sinatra file this is pretty simple. When you get a request, listen! Pass in the request and the sinatra settings.

    if request.websocket?
      @canvas.listen(request, settings)
    end
       
The view is almost as easy:

    %script{:src => "/javascripts/jquery-1.9.1.js", :type => "text/javascript"}
    = bootstrap_fontaine
    = @canvas.display
    
Bam! You need jquery. I've tested on 1.9.1, but not any other versions. bootstrap_fontaine gives you access to the fontaine javascript
file. @canvas.display will display the canvas.
    
## Action Methods

**NOTE: All coordinates are in relation to the canvas, not to the document** 0, 0 is the top-left corner of the canvas, for example.

**on_click** Yields x, y, and button

**on_mousedown** Yields x, y, and button

**on_mouseup** Yields x, y, and button

**on_mouseover** Yields x and y

**on_mouseout** Yields x and y

**on_mousemove** Yields x and y

**on_keydown** Yields key_code

(Note, this is not the ascii value of the key pressed. See javascript documentation on the difference between the
keyCode and the value)

**on_keyup** Yields key_code

**on_keypress**  Yields which
(This *is* the ascii value of the key pressed)

## Drawing methods

You can use any of the methods from 
[here](http://www.w3schools.com/tags/ref_canvas.asp) and they will work pretty much how you'd expect, with a couple 
exceptions (see **Exceptions and Issues**). Most of the time, you simply can directly use a 'rubyfied' version of the same
method. For example, instead of calling @canvas.fillRect(), you call @canvas.fill_rect. The other major exception is that rather
than setting canvas attributes with '=', you'll simply use a method of the same name (canvas.fill_style("#FF0000"), 
not canvas.fill_style = "#FF0000")

## Exceptions and Issues

Any "Drawing" method that returns an attribute doesn't "really" give you the attribute. It returns the value of the attribute from the 
last time you changed it from the ruby Canvas object. In other words, if I call 

    @canvas.fill_style("blue")

on the ruby side, then later call

    canvas.fillStyle = "#FF0000"
    
in the javascript, when I call

    @canvas.fill_style
    
in ruby, it'll still return "blue". 

Basically, this is because websocket is impatient. It doesn't have a protocol for waiting for the javascript to return information before
executing the next line of code. So, I faked it and track everything on the fontaine canvas object. 

If you stick to just using the fontaine canvas methods, this mostly doesn't have an impact, **except** that the get_image_data method isn't
implemented, and doesn't work right now. Don't even try.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

##Future Features/Goals

**Soon**

 * Implement on_keystroke methods for each key. For example, on_keystroke_a.   

**Later**

 * Figure a more elegant way to bootstrap the javascript, avoiding rackup and extending canvas
 * Add a scheduler or some other way to "wait" for get methods from the javascript

**In the distant future, when apes rule the Earth**

 * Implement this in Ruby on Rails
 * Implement audio and video tags 
