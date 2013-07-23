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
	var objectsHash = {};
    	
    ws.onmessage = function(msg)
    {
    	//alert(msg.data);
    	
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
			case "fillStyle":
				if(params.length==1)
				{
					ctx.fillStyle = params[0];
				}
				ws.send("response " + ctx.fillStyle);
				break;
			case 'fillStyleObject':
				ctx.fillStyle = objectsHash[params[0]];
				ws.send("response " + ctx.fillStyle);
				break;		    
			case "strokeStyle":
				if(params.length>0)
				{
					ctx.strokeStyle = params[0];
					//ctx.strokeStyle = "#FF0000";
				}
				ws.send("response " + ctx.strokeStyle);
				break;
			case 'strokeStyleObject':
				ctx.strokeStyle = objectsHash[params[0]];
				ws.send("response " + ctx.strokeStyle);
				break;		
			case "shadowColor":
				if(params.length>0)
				{
					ctx.shadowColor = params[0]
				}
				ws.send("response " + ctx.shadowColor);	
				break;
			case "shadowBlur":
				if(params.length>0)
				{
					ctx.shadowBlur = params[0]
				}
				ws.send("response " + ctx.shadowBlur);	
				break;
			case "shadowOffsetX":
				if(params.length>0)
				{
					ctx.shadowOffsetX = params[0]
				}
				ws.send("response " + ctx.shadowOffsetX);	
				break;
			case "shadowOffsetY":
				if(params.length>0)
				{
					ctx.shadowOffsetY = params[0]
				}
				ws.send("response " + ctx.shadowOffsetY);	
				break;
			
			case "createLinearGradient":
				objectsHash[params[4]] = 
					ctx.createLinearGradient(params[0], params[1], params[2], params[3]);
				break;	
			case "createPattern":
				objectsHash[params[2]] = ctx.createPattern(params[0], params[1]);
				break;
			case "createRadialGradient":
				objectsHash[params[6]] = 
					ctx.createRadialGradient(params[0], params[1], params[2], params[3], params[4], params[5]);
				break;
			case "addColorStop":
				objectsHash[params[2].addColorStop(params[0], params[1])];
				break;	
			case "lineCap":
				if(params.length>0)
				{
					ctx.lineCap = params[0]
				}
				ws.send("response " + ctx.lineCap);	
				break;	
			case "lineJoin":
				if(params.length>0)
				{
					ctx.lineJoin = params[0]
				}
				ws.send("response " + ctx.lineJoin);	
				break;	
			case "lineWidth":
				if(params.length>0)
				{
					ctx.lineWidth = params[0]
				}
				ws.send("response " + ctx.lineWidth);	
				break;	
			case "miterLimit":
				if(params.length>0)
				{
					ctx.miterLimit = params[0]
				}
				ws.send("response " + ctx.miterLimit);	
				break;
			case "rect":
				ctx.rect(params[0], params[1], params[2], params[3]);
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
				if(params.length==3)
				{
				  ctx.fillText(params[0], params[1], params[2]);
				}
				else
				{
				   ctx.fillText(params[0], params[1], params[2], params[3]);	
				}
				break;
			case "strokeText":
				if(params.length==3)
				{
				  ctx.strokeText(params[0], params[1], params[2]);
				}
				else
				{
				   ctx.strokeText(params[0], params[1], params[2], params[3]);	
				}
				break;
			case "measureText":
				ws.send("response " + ctx.measureText(params[0]).width);
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
				ws.send("Unimplemented command");
				break;
			   
    	}
    }
    
    
    
    
  });