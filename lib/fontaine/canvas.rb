module Fontaine
class Canvas
  attr_accessor :id
  attr_accessor :width
  attr_accessor :height
  attr_accessor :alt
  attr_accessor :html_options
  attr_accessor :settings
  
  def initialize(id, width, height, alt = "", html_options = {})
    @id = id
    @width = width
    @height = height
    @alt = alt
    @html_options = html_options
  end
  
  def start(request, settings, host = 'localhost', port = 4567, &block)  
    @settings = settings 
    block.call
    request.websocket do |ws|
      ws.onopen do
        ws.send("register ##{id}")
        @settings.sockets << ws
      end
      ws.onmessage do |msg|
        puts(msg)
        process_message(msg)
      end
      ws.onclose do
        @settings.sockets.delete(ws)
      end
    end
  end
  
  def process_message(s_message)
    a_message = s_message.split(' ')
    command = a_message[0] #the first part of the message is the command
    params = a_message[1..(a_message.length-1)] #get the rest of the message
    params = Hash[*params] if params.length%2 == 0#convert the array to a hash if applicable
    respond_to(command, params)
  end
  
  def respond_to(s_command, params = {})
    case s_command
    when "mousedown"
      trigger_on_mousedown(params["x"], params["y"])
    when "response"
      trigger_on_response(params.flatten.to_s)  
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
  
  def on_response(&blk)
    @on_response = blk 
  end
  
  def trigger_on_response(params)
    @on_response.call(params) if defined? @on_response
  end
  
  def stroke_style(style)
    if style.is_a? String
      send_msg "strokeStyle #{style}"
    else
      puts "NOT IMPLEMENTED YET" #TODO: Implement gradiants and patterns
    end
  end
  
  def stroke_rectangle(x, y, width, height)
    send_msg "strokeRect #{x} #{y} #{width} #{height}"
  end
  
  def send_msg(msg)
    @settings.sockets.each{|s| s.send(msg)} if defined? @settings
  end
  
end
end