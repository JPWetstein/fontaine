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
			case "fillRect":
				ctx.fillRect(params[0], params[1], params[2], params[3]);
				break;	
			case "clearRect":
				ctx.clearRect(params[0], params[1], params[2], params[3]);
				break;		
			case "strokeStyle":
				ctx.strokeStyle = params[0];
				ws.send("response " + ctx.strokeStyle);
				break;
			case "fill":
				ctx.fill();
				break;
			case "stroke":
				ctx.stroke();
				break;
			case "beginPath":
				ctx.beginPath();
				break;
			case "moveTo":
				ctx.moveTo(params[0], params[1]);
				break;
			case "closePath":
				ctx.closePath();
				break;
			case "lineTo":
				ctx.lineTo(params[0], params[1]);
				break;	
			case "clip":
				ctx.clip();
				break;
			case "quadraticCurveTo":
				ctx.quadraticCurveTo(params[0], params[1], params[2], params[3]);
				break;
			case "bezierCurveTo":
				ctx.bezierCurveTo(params[0], params[1], params[2], params[3], params[4], params[5]);
				break;
			case "arc":
				ctx.arc(params[0], params[1], params[2], params[3], params[4], params[5]);
				break;
			case "arcTo":
				ctx.arcTo(params[0], params[1], params[2], params[3], params[4]);
				break;
			case "isPointInPath":
				ctx.isPointInPath(params[0], params[1]);
				break;
			case "scale":
				ctx.scale(params[0], params[1]);
				break;
			case "rotate":
				ctx.rotate(params[0]);
				break;
			case "translate":
				ctx.translate(params[0], params[1]);
				break;
			case "transform":
				ctx.transform(params[0], params[1], params[2], params[3], params[4], params[5]);
				break;
			case "setTransform":
				ctx.setTransform(params[0], params[1], params[2], params[3], params[4], params[5]);
				break;
			case "font":
				if(params.length!=0)
				{
					ctx.font = params.join(" ");
				}
				ws.send("response " + ctx.font);
				break;
			case "textAlign":
				ctx.textAlign = params[0];
				break;	
			case "textBaseline":
				ctx.textBaseline = params[0];
				break;	
			case "fillText":
				if(params.lenth==3)
				{
				  ctx.fillText(params[0], params[1], params[2]);
				}
				else
				{
				   ctx.fillText(params[0], params[1], params[2], params[3]);	
				}
				break;
			case "strokeText":
				if(params.lenth==3)
				{
				  ctx.strokeText(params[0], params[1], params[2]);
				}
				else
				{
				   ctx.strokeText(params[0], params[1], params[2], params[3]);	
				}
				break;
			case "measureText":
				ws.send("response " + ctx.measureText(params[0]).width));
				break;
			case "drawImage":
				var img=document.getElementById(params[0]);
				if(params.length == 3)
				{
				  ctx.drawImage(img, params[1], params[2]);
				}
				else if(params.length == 5)
				{
				  ctx.drawImage(img, params[1], params[2], params[3], params[4]);
				} 	
				else
				{
				  ctx.drawImage(img, params[1], params[2], params[3], params[4], params[5], params[6]);	
				}
				break;
				  
			default:
				alert("Unknown command");
			   
    	}
    }
    
    
    
    
  });