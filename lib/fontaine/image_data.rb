module Fontaine
class ImageData
  attr_accessor :id
  attr_accessor :canvas
  
  def initialize(id, canvas, *args)
    @id = id
    @canvas = canvas #is this ok? test
    if(args.size == 2)
    
      @canvas.send_msg("createImageData #{args[0]} #{args[1]} #{id}")
    
    elsif(args.size == 1)
      @canvas.send_msg("createImageData #{args[0]} #{id}")
    end
    
  end

  def data(pixel, value="")
    @canvas.send_msg("imageDataData #{id} #{pixel} #{value}")
    return @canvas.last_response
  end
  
  def width
    @canvas.send_msg("imageDataWidth #{id}")
    return @canvas.last_response
  end
  
  def width
    @canvas.send_msg("imageDataheight #{id}")
    return @canvas.last_response
  end
  
  
end
end