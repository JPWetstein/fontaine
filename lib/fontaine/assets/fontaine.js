/**
 * @author McTighe-Wetstein, J. Paul
 */
$(document).ready(function()
  { 
  	alert("TEST!");
    var ws = new WebSocket('ws://' + window.location.host + window.location.pathname);
    var canvas = $('#ABC');
    
    canvas.on('mousedown', function(e)
    {
      ws.send("on_click x 0 y 0");
    });
    
  });