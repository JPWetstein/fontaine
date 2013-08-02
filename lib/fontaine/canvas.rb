module Fontaine
class Canvas
  attr_accessor :id
  attr_accessor :width
  attr_accessor :height
  attr_accessor :alt
  attr_accessor :html_options
  attr_accessor :settings
  attr_accessor :ws
  attr_accessor :last_response
  attr_accessor :attributes
  
  
  def initialize(id, width, height, alt = "", html_options = {})
    @id = id
    @width = width
    @height = height
    @alt = alt
    @html_options = html_options
    @attributes = {
      :fill_style => "#000000", 
      :stroke_style => '#000000',
      :shadow_color => '#000000',
      :shadow_blur => 0,
      :shadow_offset_x => 0,
      :shadow_offset_y => 0,
      :line_cap => 'butt',
      :line_join => 'miter',
      :line_width => '1',
      :miter_limit => '10',
      :font => '10px sans-serif',
      :text_align => 'start',
      :text_baseline => 'alphabetic',
      :global_alpha => 1.0,
      :global_composite_operation => 'source-over'
      
      }
  end
  
  def start(request, settings, host = 'localhost', port = 4567, &block)  
    @settings = settings 
    
    
    request.websocket do |ws|
      block.call
      ws.onopen do
        
        @ws = ws
        @ws.send("register ##{id}")
        @settings.sockets << ws
        
        
        
      end
      ws.onmessage do |msg|
        #puts("recieved message: #{msg}")
        #EM.next_tick { process_message(msg)}
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
      trigger_on_mousedown(params["x"], params["y"], params["button"])
    when "mouseup"
      trigger_on_mouseup(params["x"], params["y"], params["button"])
    when "mouseover"
      trigger_on_mouseover(params["x"], params["y"]) 
    when "mouseout"
      trigger_on_mouseout(params["x"], params["y"]) 
    when "mousemove"
      trigger_on_mousemove(params["x"], params["y"])
    when "touchstart"
      trigger_on_touchstart(params["x"], params["y"], params["id"])  
    when "touchmove"
      trigger_on_touchstart(params["x"], params["y"], params["id"])
    when "touchend"
      trigger_on_touchstart(params["x"], params["y"], params["id"])               
    when "keyup"
      trigger_on_keyup(params["key_code"])    
    when "keydown"
      trigger_on_keydown(params["key_code"])
    when "keypress"
      trigger_on_keypress(params["which"])
    when "click"
      trigger_on_click(params["x"], params["y"], params["button"])      
    when "response"
      @last_response =  params.flatten[0].to_s
      trigger_on_response(@last_response)
    else
      puts "unimplemented method #{s_command}"
    end
  end
  
  def display    
    options = ""
    @html_options.each_pair do  |key, value| 
      options << "#{key}=\"#{value}\" "
    end
    return "<canvas id=\"#{@id}\" width=\"#{@width}\" height=\"#{@height}\" #{options}>#{@alt}</canvas>"
  end

  def fill_style(style="", &blk)
    if style.is_a? String
      send_msg "fillStyle #{style}"
    else
      send_msg "fillStyleObject #{style.id}"
    end
    
    # return @last_response
    return @attributes[:fill_style]
    
  end
  
  def stroke_style(style="")
    if style.is_a? String
      send_msg "strokeStyle #{style}"
    else
      send_msg "strokeStyleObject #{style.id}"
    end
    # return @last_response
    return @attributes[:stroke_style]
  end
  
  def create_linear_gradient(x0, y0, x1, y1, id)
    send_msg("createLinearGradient #{x0} #{y0} #{x1} #{y1} #{id}")
    return Gradient.new(id, self)
  end
  
  def create_pattern(image, pattern)
    send_msg("createPattern #{image.id} #{pattern}")
    return Pattern.new(id)
  end
  
  def create_radial_gradient(x0, y0, r0, x1, y1, r1, id)
    send_msg("createRadialGradient #{x0} #{y0} #{r0} #{x1} #{y1} #{r1} #{id}")
    return Gradient.new(id, self)
  end
  
  def create_image_data(id, *args)
    return image_data.new(id, self, args)
  end
  
  # def get_image_data(id, x, y, width, height)
    # send_msg("getImageData #{x} #{y} #{width} #{height} #{id}")
    # return image_data.new(id, self)
  # end
  
  def put_image_data(image, x, y, dirty_x="", dirty_y="", dirty_width="", dirty_height="")
    send_msg("putImageData #{image.id} #{x} #{y} #{dirty_x} #{dirty_y} #{dirty_width} #{dirty_height}")
  end
  
  def send_msg(msg)
    #puts "Sending message: #{msg}"
    #EM.next_tick {@ws.send(msg)} if defined? @ws
    @ws.send(msg) if defined? @ws
  end
  
  def method_missing(method_sym, *arguments, &block)
    if canvas_array.include? method_sym.to_s.sub(/trigger_on_/, "")
      variable_name = method_sym.to_s.sub(/trigger_/, "@")
      instance_variable_get(variable_name).call(arguments) if instance_variable_defined?(variable_name)
    elsif canvas_array.include? method_sym.to_s.sub(/on_/, "")
      instance_variable_set("@#{method_sym}", block)
    elsif draw_method_array.include? method_sym.to_s
      send_msg "#{ruby_to_js_command(method_sym)} #{arguments.join(" ")}"
    elsif return_method_array.include? method_sym.to_s
      send_msg "#{ruby_to_js_command(method_sym)} #{arguments.join(" ")}"
      @attributes[method_sym] = arguments[0] if (!arguments[0].nil? && !@attributes[method_sum].nil?)
      return @attributes[method_sym]
    else
      super(method_sym, *arguments, &block)
    end
  end
  
  def canvas_array
    return["response", "mousedown", "mouseup", "keyup", "keydown", "keypress", "click", "mouseover", 
      "mouseout", "mousemove", "touchstart", "touchmove", "touchend"]
  end
  
  def return_method_array
    return[
       #Colors, Styles, and Shadows
      "shadow_color", "shadow_blur", "shadow_offset_x", "shadow_offset_y",
      #Line Styles
      "line_cap", "line_join", "line_width", "miter_limit",
      #Paths
      "isPointInPath",
      #Text
      "font", "text_align", "text_baseline",
      #Composting
      "global_alpha", "global_composite_operation",
      #Other
      "to_data_url"
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
      "draw_image",
      #Other
      "save", "restore"
      ]
  end
  
  def ruby_to_js_command(method_sym)
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