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
			      ws.send("mousedown x "+current_mouse.x+" y "+current_mouse.y + " button "+ e.button);
			    });
			    
			    canvas.on('mouseup', function(e)
			    {
			      current_mouse = 
				  {
				      x: e.pageX - canvasPosition.x,
				      y: e.pageY - canvasPosition.y
				  }
			      ws.send("mouseup x "+current_mouse.x+" y "+current_mouse.y + " button "+ e.button);
			    });
			    
			    canvas.on('click', function(e)
				{
				  current_mouse = 
				  {
				      x: e.pageX - canvasPosition.x,
				      y: e.pageY - canvasPosition.y
				  }
			      ws.send("click x "+current_mouse.x+" y "+current_mouse.y + " button "+ e.button);
				});
				
				canvas.on('mousemove', function(e)
				{
				  current_mouse = 
				  {
				      x: e.pageX - canvasPosition.x,
				      y: e.pageY - canvasPosition.y
				  }
			      ws.send("mousemove x "+current_mouse.x+" y "+current_mouse.y + " button "+ e.button);	
				});
				
				canvas.on('mouseover', function(e)
				{
				  current_mouse = 
				  {
				      x: e.pageX - canvasPosition.x,
				      y: e.pageY - canvasPosition.y
				  }
			      ws.send("mouseover x "+current_mouse.x+" y "+current_mouse.y + " button "+ e.button);	
				});
				
				canvas.on('mouseout', function(e)
				{
				  current_mouse = 
				  {
				      x: e.pageX - canvasPosition.x,
				      y: e.pageY - canvasPosition.y
				  }
			      ws.send("mouseout x "+current_mouse.x+" y "+current_mouse.y + " button "+ e.button);	
				});
				
				canvas.on('touchstart', function(e)
				{
				  current_touch = 
				  {
				      x: e.pageX - canvasPosition.x,
				      y: e.pageY - canvasPosition.y
				  }
			      ws.send("touchstart x "+current_touch.x+" y "+current_touch.y);	
				});
				
				canvas.on('touchmove', function(e)
				{
				  current_touch = 
				  {
				      x: e.pageX - canvasPosition.x,
				      y: e.pageY - canvasPosition.y
				  }
			      ws.send("touchmove x "+current_touch.x+" y "+current_touch.y);	
				});
				
				canvas.on('touchend', function(e)
				{
				  current_touch = 
				  {
				      x: e.pageX - canvasPosition.x,
				      y: e.pageY - canvasPosition.y
				  }
			      ws.send("touchend x "+current_touch.x+" y "+current_touch.y);	
				});
			    
			    document.onkeyup = function(e) 
			    {
					ws.send("keyup key_code "+e.keyCode); //+ " which " + e.which + " char_code " + e.charCode);				  
				}
			    
			    document.onkeydown = function(e) 
			    {
					ws.send("keydown key_code "+e.keyCode); //+ " which " + e.which + " char_code " + e.charCode);				  
				}
				
				document.onkeypress = function(e) 
				{
					ws.send("keypress key_code "+e.keyCode); //+ " which " + e.which + " char_code " + e.charCode);				  
				}
				
				
			    
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
				if(params.length!=0)
				{
					ctx.textAlign = params[0];
				}
				ws.send("response " + ctx.textAlign);	
				break;	
			case "textBaseline":
				if(params.length!=0)
				{
					ctx.textBaseline = params[0];
				}
				ws.send("response " + ctx.textBaseline);	
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
			case "imageDataWidth":
				var img=objectsHash[params[0]];
				ws.send("response " + img.width);
				break;
			case "imageDataHeight":
				var img=objectsHash[params[0]];
				ws.send("response " + img.height);
				break;	
			case "imageDataData":
				var img=objectsHash[params[0]];
				ws.send("response " + img.data);
				break;
			case "createImageData":
				var img;
				if(params.length == 3)
				{
					img = ctx.createImageData(params[0], params[1]);
				}
				else if(params.length == 2)
				{
					
					img = ctx.createImageData(objectsHash[params[0]]);
				}
				objectsHash[params[params.length-1]] = img;
				break;
			case "getImageData":
				var img;
				img = ctx.getImageData(params[0], params[1], params[2], params[3])
				objectsHash[params[4]] = img;
				break;
			case "putImageData":
				var img	= objectsHash[params[0]];
				if(params.length == 3)
				{
					ctx.putImageData(img, params[1], params[2]);
				}
				else if(params.length == 5)
				{
					ctx.putImageData(img, params[1], params[2], params[3], params[4]);
				}
				else if(params.length == 7)
				{
					ctx.putImageData(img, params[1], params[2], params[3], params[4], params[5], params[6]);
				}
				break;
			case "globalAlpha":
				if(params.length!=0)
				{
					ctx.globalAlpha = params[0];
				}
				ws.send("response " + ctx.globalAlpha);	
				break;
			case "globalCompositeOperation":
				if(params.length!=0)
				{
					ctx.globalCompositeOperation = params[0];
				}
				ws.send("response " + ctx.globalCompositeOperation);	
				break;
			case "save":
				ctx.save();
				break;
			case "restore":
				ctx.restore();					
				break;
			case "toDataUrl":
				ws.send("response " + ctx.toDataURL());
				break;		  
			default:
				ws.send("Unimplemented command");
				break;
			   
    	}
    }
    
    
    
    
  });