module Fontaine
class Canvas
  attr_accessor :id
  attr_accessor :width
  attr_accessor :height
  attr_accessor :alt
  attr_accessor :html_options
  attr_accessor :settings
  attr_accessor :last_response
  
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
        puts("received message: #{msg}")
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
    params = Hash[*params] if command != "response"#convert the array to a hash if applicable
    respond_to(command, params)
  end
  
  def respond_to(s_command, params = {})
    case s_command
    when "mousedown"
      trigger_on_mousedown(params["x"], params["y"])
    when "response"
      @last_response =  params.flatten.to_s
      trigger_on_response(@last_response)  
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
  
  def fill_style(style)
    if style.is_a? String
      send_msg "fillStyle #{style}"
    else
      puts "NOT IMPLEMENTED YET" #TODO: Implement gradiants and patterns
    end
    return @last_response
  end
  
  def stroke_style(style)
    if style.is_a? String
      send_msg "strokeStyle #{style}"
    else
      puts "NOT IMPLEMENTED YET" #TODO: Implement gradiants and patterns
    end
    return @last_response
  end
  
  def create_linear_gradient(x0, y0, x1, y1, id)
    send_msg("linearGradient #{x0} #{y0} #{x1} #{y1} #{id}")
    return Gradient.new(id)
  end
  
  def send_msg(msg)
    puts "Sending message: #{msg}"
    EM.next_tick {@settings.sockets.each{|s| s.send(msg)} if defined? @settings}
  end
  
  def method_missing(method_sym, *arguments, &block)
    if draw_method_array.include? method_sym.to_s
      send_msg "#{rubyToJsCommand(method_sym)} #{arguments.join(" ")}"
    elsif return_method_array.include? method_sym.to_s
      send_msg "#{rubyToJsCommand(method_sym)} #{arguments.join(" ")}"
      return @last_response  
    else
      super(method_sym, *arguments, &block)
    end
  end
  
  def return_method_array
    return[
       #Colors, Styles, and Shadows
      "fill_style", "stroke_style", "shadow_color", "shadow_blur", "shadow_offset_x", "shadow_offset_y",
      #TODO:"create_linear_gradient", "create_pattern", "create_radial_gradient", "add_color_stop",
      #Line Styles
      "line_cap", "line_join", "line_width", "miter_limit",
      #Paths
      "isPointInPath",
      #Text
      "font", "text_align", "text_baseline"
     ]
  end
  
  def draw_method_array
    return [
      #Rectangles
      "rect", "fill_rect", "stroke_rect", "clear_rect", 
      #Paths
      "fill", "stroke", "begin_path", "move_to", "close_path", "line_to", "clip", 
      "quadratic_curve_to", "bezier_curve_to", "arc", "arc_to",
      #Transformations
      "scale", "rotate", "translate", "transform", "set_transform",
      #Text
      "fill_text", "stroke_text", "measure_text",
      #Image Drawing
      #TODO: draw_image
      #Pixel Manipulation
      #TODO: width, height, data, create_image_data, get_image_data, put_image_data
      #Composting
      #TODO: global_alpha, global_composite_operation
      #Other
      #TODO: save, restore, create_event, get_context, to_data_url
      ]
  end
  
  def rubyToJsCommand(method_sym)
    js_command = method_sym.to_s
    js_commands = js_command.split('_')
    if js_commands.size > 1
      js_commands[1..js_commands.size].each do |command|
        command.capitalize!
      end
    end
    js_commands.join
  end
  
  
  
end
end