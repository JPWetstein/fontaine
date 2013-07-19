module Fontaine
class Canvas
  attr_accessor :id
  attr_accessor :width
  attr_accessor :height
  attr_accessor :alt
  attr_accessor :html_options
  
  def initialize(id, width, height, alt = "", html_options = {})
    @id = id
    @width = width
    @height = height
    @alt = alt
    @html_options = html_options
  end
  
  def start(request, settings, host = 'localhost', port = 4567, &block)   
    block.call
    request.websocket do |ws|
      ws.onopen do
        ws.send("register ##{id}")
        settings.sockets << ws
      end
      ws.onmessage do |msg|
        #puts(msg)
        ws.send process_message(msg)
      end
      ws.onclose do
        settings.sockets.delete(ws)
      end
    end
  end
  
  def process_message(s_message)
    a_message = s_message.split(' ')
    command = a_message[0] #the first part of the message is the command
    params = a_message[1..(a_message.length-1)] #get the rest of the message
    params = Hash[*params] #convert the array to a hash
    respond_to(command, params)
  end
  
  def respond_to(s_command, params = {})
    case s_command
    when "mousedown"
      trigger_on_mousedown(params["x"], params["y"])
    else
      puts "unimplemented method"
    end
  end
  
  def display    
    options = ""
    @html_options.each_pair do  |key, value| 
      options << "#{key}=\"#{value}\" "
    end
    return "<canvas id=\"#{@id}\" width=\"#{@width}\" height=\"#{@height}\" #{options}>#{@alt}</canvas>"
  end
  
  def on_mousedown(&blk)
    @on_mousedown = blk 
  end
  
  def trigger_on_mousedown(x,y)
    @on_mousedown.call(x,y) if defined? @on_mousedown
  end
  
  def draw
    "draw"
  end
  
  def stroke_rectangle(x, y, width, height)
    "strokeRect #{x} #{y} #{width} #{height}"
  end
  
  def open_connection
    #open websocket connection
  end
  
  def close_connection
    #close websocket connection
  end
  
end
end