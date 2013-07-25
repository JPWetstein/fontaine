module Fontaine
class Gradient
  attr_accessor :id
  attr_accessor :canvas
  def initialize(id, canvas)
    @id = id
    @canvas = canvas #is this ok? test
  end
  
  def add_color_stop(stop, color)
    @canvas.send_msg("addColorStop #{stop} #{color} #{@id}")
  end
  
end
end