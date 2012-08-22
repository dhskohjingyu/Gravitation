var earth;
var moon;
var sun;
var xcenter = 200;
var ycenter = 200;

// sun (optional), earth, moon, mercury, venus
var rradius=[1498,0,579.1,1082];
var radius = [90, 200, 30, 100, 140];
var rspeed=[29.09, 0, 47.75, 34.94];
var speed = [2, 8, 2, 3];
var rotation_speed = [2, 2, 5, 3, 2]
var rotation = [0, 0, 0, 0, 0]
var degree = [0, 0, 0, 0, 0];
var radian = [0, 0, 0, 0, 0];
// sun, earth, mercury, venus
var initial_mass = [1988920, 59.7, 3.30, 16.6];
var mass = [1988920, 59.7, 3.30, 16.6];
var density = [1.41, 5.52, 5.42, 5.03];
var volume = [1409000, 10.8, 0.608, 3.30];

var pause = false;

function pause_loop()
{
	pause = !pause;
	
	if(pause)
	{
		$("#pause").html('<img src="images/play.png"/>');
	}
	else
	{
		$("#pause").html('<img src="images/pause.png"/>');
	}
}

function init()
{
	earth = $("#earth");
	moon = $("#moon");
	mercury = $("#mercury");
	venus = $("#venus");
	sun = $("#sun");
	
	container_center = $("#container").width() * 0.5;
	
	xcenter = container_center;
	ycenter = container_center;
	
	m_xcenter = earth.left;
	m_ycenter = earth.top;
	
	sun.css("left", container_center + "px");
	sun.css("top", container_center + "px");
	
	mass[0] = density[0] * volume[0];
	$("#sun > #amount").text("Density: " + density[0].toFixed(2) + "  Mass: " + mass[0].toFixed(2));
	$("#sun > #amount").css("width", 300 + "px");
	
	mass[1] = density[1] * volume[1];
	$("#earth > #amount").text("Density: " + density[1].toFixed(2) + "  Mass: " + mass[1].toFixed(2));
	$("#earth > #amount").css("width", 300 + "px");

	mass[2] = density[2] * volume[2];
	$("#mercury > #amount").text("Density: " + density[2].toFixed(2) + "  Mass: " + mass[2].toFixed(2));
	$("#mercury > #amount").css("width", 300 + "px");
	
	mass[3] = density[3] * volume[3];
	$("#venus > #amount").text("Density: " + density[3].toFixed(2) + "  Mass: " + mass[3].toFixed(2));
	$("#venus > #amount").css("width", 300 + "px");
	
	//jQuery slider
	$("#sun > #slider").slider(
	{
		range: "min",
		value: 1.41,
		min: 0.70,
		max: 2.11,
		step: 0.01,
		
		slide: function(event, ui)
		{
			density[0] = ui.value;
			//slider_left = radius[0] + 20;	
			mass[0] = density[0] * volume[0];
			speed[0] = Math.sqrt(6.67*mass[0]/radius[1])/(120);  //earth
			rspeed[0] = Math.sqrt((6.67 * Math.pow(10, -11) * mass[0] * Math.pow(10, 30))/(rradius[0] * Math.pow(10, 8)))/(Math.pow(10, 6));

			speed[2] = Math.sqrt(6.67*mass[0]/radius[3])/(120);  //mercury
			rspeed[2] = Math.sqrt((6.67 * Math.pow(10, -11) * mass[0] * Math.pow(10, 30))/(rradius[2] * Math.pow(10, 8)))/(Math.pow(10, 6));
			speed[3] = Math.sqrt(6.67*mass[0]/radius[4])/(120);  //venus
			rspeed[3] = Math.sqrt((6.67 * Math.pow(10, -11) * mass[0] * Math.pow(10, 30))/(rradius[3] * Math.pow(10, 8)))/(Math.pow(10, 6));
			
			rotation_speed[0]=2*(mass[0]/initial_mass[0]);
			
			$("#sun > #amount").text("Density: " + density[0].toFixed(2) + "  Mass: " + mass[0].toFixed(2));
			$("#facts").text(initial_mass[0]);
			//$(this).css("left", slider_left + "px");
			//$("#amount").css("left", slider_left + "px");

			//$("#sun").width(radius[0] * 2 + s_slider_width);
			$("#sundata #density").text(density[0].toFixed(2));
			$("#sundata #mass").text(mass[0].toFixed(2));
			$("#earthdata #speed").text(rspeed[0].toFixed(2));
			$("#mercurydata #speed").text(rspeed[2].toFixed(2));
			$("#venusdata #speed").text(rspeed[3].toFixed(2));
		}
	});
	
	$("#sun > #slider").width(100);
	s_slider_width = 130;
	s_initial_height = $("#sun").height();
	
	$("#sun").hover(function()
	{
		pause = true;
		//pause_loop();
		//$(this).width(radius[0] * 2 + s_slider_width);
		$(this).width(440 + radius[0]);
		$(this).height(220);
		$(this).css("background-color", "#333");
		$(this).css("opacity", "0.8");
		$(this).css("z-index", "1");
		//$(this).animate({width:radius[0] + radius[0] + s_slider_width},'fast',function(){});
	},
	function ()
	{
		pause_loop();
		$(this).width(radius[0]);
		$(this).height(100);
		$(this).css("background-color", "transparent");
		$(this).css("opacity", "1.0");
		$(this).css("z-index", "0");
		//$(this).animate({width:radius[0]},'fast',function(){});
	});
	
	$("#earth > #slider").slider(
	{
		range: "min",
		value: 5.52,
		min: 2.76,
		max: 8.28,
		step: 0.01,
		
		slide: function(event, ui)
		{
			density[1] = ui.value;
			
			mass[1] = density[1] * volume[1];
			speed[1] = Math.sqrt(6.67*mass[1]/radius[2])*2;
			rotation_speed[1]=2*(mass[1]/initial_mass[1]);
			
			$("#earth > #amount").text("Density: " + density[1].toFixed(2) + "  Mass: " + mass[1].toFixed(2));
			
			$("#earthdata #density").text(density[1].toFixed(2));
			$("#earthdata #mass").text(mass[1].toFixed(2));
		}
	});
	
	$("#earth > #slider").width(100);
	e_slider_width = 150;
	e_initial_height = $("#earth").height();
	
	$("#earth").hover(function()
	{
		pause = true;
		$(this).width(330 + $("#earth_image").width());
		$(this).css("background-color", "#333");
		$(this).css("opacity", "0.8");
		$(this).css("z-index", "1");
		$(this).height(250);
		//$(this).width(radius[1] + radius[1] + e_slider_width)
		//$(this).animate({width:radius[1] + radius[1] + e_slider_width},'fast',function(){});
	},
	function ()
	{
		pause_loop();
		$(this).width(e_slider_width/5)
		$(this).height(30);
		$(this).css("background-color", "transparent");
		$(this).css("opacity", "1.0");
		$(this).css("z-index", "0");
		//$(this).animate({width:e_slider_width/5},'fast',function(){});
	});
	
	$("#mercury > #slider").slider(
	{
		range: "min",
		value: 5.42,
		min: 2.71,
		max: 8.13,
		step: 0.01,
		
		slide: function(event, ui)
		{
			density[2] = ui.value;
			//slider_left = radius[0] + 20;
			mass[2] = density[2] * volume[2];
			
			rotation_speed[3]=3*(mass[3]/initial_mass[3]);
			
			$("#mercury > #amount").text("Density: " + density[2].toFixed(2) + "  Mass: " + mass[2].toFixed(2));

			//$(this).css("left", slider_left + "px");
			//$("#amount").css("left", slider_left + "px");
			
			//$("#earth").width(radius[1] * 2 + e_slider_width);
			$("#mercurydata #density").text(density[2].toFixed(2));
			$("#mercurydata #mass").text(mass[2].toFixed(2));
		}
	});
	
	$("#mercury > #slider").width(100);
	m_slider_width = 170;
	m_initial_height = $("#mercury").height();
	
	$("#mercury").hover(function()
	{
		pause = true;
		//$(this).width(m_slider_width);
		$(this).width(580);
		$(this).height(160);
		$(this).css("background-color", "#333");
		$(this).css("opacity", "0.8");
		$(this).css("z-index", "1");
		//$(this).animate({width:m_slider_width},'fast',function(){});
	},
	function ()
	{
		pause_loop();
		$(this).width(60);
		$(this).height(60);
		$(this).css("background-color", "transparent");
		$(this).css("opacity", "1.0");
		$(this).css("z-index", "0");
		//$(this).animate({width:m_slider_width/5},'fast',function(){});
	});
	
	$("#venus > #slider").slider(
	{
		range: "min",
		value: 5.03,
		min: 2.52,
		max: 7.55,
		step: 0.01,
		
		slide: function(event, ui)
		{
			density[3] = ui.value	;
			mass[3] = density[3] * volume[3];
			rotation_speed[4]=2*(mass[3]/initial_mass[3]);
			
			$("#venus > #amount").text("Density: " + density[3].toFixed(2) + "  Mass: " + mass[3].toFixed(2));
			
			$("#venusdata #density").text(density[3].toFixed(2));
			$("#venusdata #mass").text(mass[3].toFixed(2));
		}
	});
	
	$("#venus > #slider").width(100);
	v_initial_height = $("#venus").height();
	v_slider_width = 200;
	
	$("#venus").hover(function()
	{
		pause = true;
		$(this).width(470);
		$(this).height(200);
		$(this).css("background-color", "#333");
		$(this).css("opacity", "0.8");
		$(this).css("z-index", "1");
		//$(this).width(v_slider_width);
		//$(this).animate({width:v_slider_width},'fast',function(){});
	},
	function ()
	{
		pause_loop();
		$(this).width(v_slider_width/5);
		$(this).height(50);
		$(this).css("background-color", "transparent");
		$(this).css("opacity", "1.0");
		$(this).css("z-index", "0");
		//$(this).animate({width:v_slider_width/5},'fast',function(){});
	});

	// pause button function
	$("#pause").click(function()
	{
		pause_loop();
	});
	
	setInterval(loop, 20);
}

function loop()
{
	sun_image = $("#sun_image");
	earth_image = $("#earth_image");
	moon_image = $("#moon_image");
	mercury_image = $("#mercury_image");
	venus_image = $("#venus_image");
	
	if(!pause)
	{
		// Sun
		rotation[0] += rotation_speed[0];
		
		sun_image.css("-moz-transform", "rotate(" + rotation[0] + "deg)");
		sun_image.css("-ms-transform", "rotate(" + rotation[0] + "deg)");
		sun_image.css("-webkit-transform", "rotate(" + rotation[0] + "deg)");
		sun_image.css("-o-transform", "rotate(" + rotation[0] + "deg)");
		
		// Earth
		degree[1] += speed[0];
		radian[1] = (degree[1]/180) * Math.PI;
		var xpos = xcenter + Math.cos(radian[1]) * radius[1];
		var ypos = ycenter - Math.sin(radian[1]) * radius[1];
		
		earth.css("left", xpos + "px");
		earth.css("top", ypos + "px");
		
		rotation[1] += rotation_speed[1];
		
		earth_image.css("-moz-transform", "rotate(" + rotation[1] + "deg)");
		earth_image.css("-ms-transform", "rotate(" + rotation[1] + "deg)");
		earth_image.css("-webkit-transform", "rotate(" + rotation[1] + "deg)");
		earth_image.css("-o-transform", "rotate(" + rotation[1] + "deg)");
		
		// Moon
		degree[2] += speed[1];
		radian[2] = (degree[2]/180) * Math.PI;
		var m_xpos = xpos + Math.cos(radian[2]) * radius[2] + moon.width() * 0.5;
		var m_ypos = ypos - Math.sin(radian[2]) * radius[2] + moon.width() * 0.5;
		
		moon.css("left", m_xpos + "px");
		moon.css("top", m_ypos + "px");
		
		rotation[2] += rotation_speed[2];
		
		moon_image.css("-moz-transform", "rotate(" + rotation[2] + "deg)");
		moon_image.css("-ms-transform", "rotate(" + rotation[2] + "deg)");
		moon_image.css("-webkit-transform", "rotate(" + rotation[2] + "deg)");
		moon_image.css("-o-transform", "rotate(" + rotation[2] + "deg)");
		
		// Mercury
		degree[3] += speed[2];
		radian[3] = (degree[3]/180) * Math.PI;
		var xpos = xcenter + Math.cos(radian[3]) * radius[3];
		var ypos = ycenter - Math.sin(radian[3]) * radius[3];
		
		mercury.css("left", xpos + "px");
		mercury.css("top", ypos + "px");
		
		rotation[3] += rotation_speed[3];
		
		mercury_image.css("-moz-transform", "rotate(" + rotation[3] + "deg)");
		mercury_image.css("-ms-transform", "rotate(" + rotation[3] + "deg)");
		mercury_image.css("-webkit-transform", "rotate(" + rotation[3] + "deg)");
		mercury_image.css("-o-transform", "rotate(" + rotation[3] + "deg)");
		
		// Venus
		degree[4] += speed[3];
		radian[4] = (degree[4]/180) * Math.PI;
		var xpos = xcenter + Math.cos(radian[4]) * radius[4];
		var ypos = ycenter - Math.sin(radian[4]) * radius[4];
		
		venus.css("left", xpos + "px");
		venus.css("top", ypos + "px");
		
		rotation[4] += rotation_speed[4];
		
		venus_image.css("-moz-transform", "rotate(" + rotation[4] + "deg)");
		venus_image.css("-ms-transform", "rotate(" + rotation[4] + "deg)");
		venus_image.css("-webkit-transform", "rotate(" + rotation[4] + "deg)");
		venus_image.css("-o-transform", "rotate(" + rotation[4] + "deg)");
	}
	
	// Resize sun
	
	//sun.css("left", xpos + "px");
	//sun.css("top", ypos + "px");
	sun_image.width(radius[0]);
	sun_image.height(radius[0]);
	
	container_center = ($("#container").width() + sun_image.width() - earth_image.width()) * 0.5;
	
	xcenter = container_center;
	ycenter = container_center;
}