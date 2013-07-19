/**
 * @author McTighe-Wetstein, J. Paul
 */
$(document).ready(function()
  {
    var ws = new WebSocket('ws://' + window.location.host + window.location.pathname);
    
	var canvas;
	var ctx;
	var canvasPosition;
	var current_mouse;
    	
    ws.onmessage = function(msg)
    {
    	
    	msg_array = msg.data.split(" ");
    	command = msg_array[0];
    	msg_array.shift();
    	params = msg_array;
    	
    	switch(command)
    	{
    		
    		case "register":
	    		canvas = $(params[0]);
	    		ctx=canvas[0].getContext('2d');
	    		
	    		canvasPosition = 
				{
				    x: canvas.offset().left,
				    y: canvas.offset().top
				};
	    		
	    		canvas.on('mousedown', function(e)
			    {
			      current_mouse = 
				  {
				      x: e.pageX - canvasPosition.x,
				      y: e.pageY - canvasPosition.y
				  }
			      ws.send("mousedown x "+current_mouse.x+" y "+current_mouse.y);
			    });
			    break;
		    case "strokeRect":
				ctx.strokeRect(params[0], params[1], params[2], params[3]);
				break;
			case "strokeStyle":
				ctx.strokeStyle = params[0];
				ws.send("response " + ctx.strokeStyle);
				break;
			default:
				alert("Unknown command");
			   
    	}
    }
    
    
    
    
  });