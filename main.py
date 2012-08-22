#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

import webapp2
import urllib
import cgi

from google.appengine.ext import db
from google.appengine.api import users

score = 0
quiz_type = "before"

class Marks(db.Model):
    author = db.StringProperty()
    before = db.StringProperty()
    after = db.StringProperty()

def quiz_key(quiz_name=None):
    return db.Key.from_path('Quiz', quiz_name or 'default_quiz')

class Quiz(webapp2.RequestHandler):
    def post(self):
        quiz_name = self.request.get("quiz_name")

        user = users.get_current_user()
        
        marks = db.GqlQuery("SELECT * "
                            "FROM Marks "
                            "WHERE ANCESTOR IS :1 "
                            "ORDER BY author DESC LIMIT 10",
                            quiz_key(quiz_name))

        new_marks = Marks(parent=quiz_key(quiz_name))
        
        for mark in marks:
            if mark.author == user.nickname():
                new_marks = mark
                break

        if user:
            new_marks.author = user.nickname()

        if quiz_type == "before":
            new_marks.before = str(score)
        else:
            new_marks.after = str(score)

        new_marks.put()

        self.response.out.write("""
<!DOCTYPE html>
<head>
<title>Diagnostic Test</title>

<link rel="stylesheet" type="text/css" href="css/quiz_stylesheet.css"/>
</head>

<body>
<div align="center">
Thanks for taking our diagnostic test.
<br></br>

Now, try out our planet simulation in order to further your knowledge about gravity.
<br></br>""")

        self.response.out.write("""
    <form action="/orbit" method="get">
        <input type="submit" value="Go!" />
    </form>
</div>
</body>

</html>
    """)
        
class Orbit(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        
        self.response.out.write("""
<DOCTYPE html>

<head>
<title>Circular Motion!</title>

<link rel="stylesheet" type="text/css" href="css/stylesheet.css"/>
<link rel="stylesheet" type="text/css" href="css/smoothness/jquery-ui-1.8.21.custom.css"/>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script src="scripts/jquery-ui-1.8.16.custom.min.js"></script>
<script src="scripts/main.js"></script>
</head>

<body style="background-image: url(http://people.dhs.sg/kohjingyu/images/background.jpg)" onLoad="init()">""")
                
        self.response.out.write("""
<div id="container">

	<div id="earth" width="30" height="30">
    	<img src="images/earth.png"id="earth_image"/>
		<div id="amount"></div>
		<div id="slider" ></div>
		<br>
		<div id="info">
        Earth interacts with other objects in space, especially the Sun and the Moon. At present, Earth orbits the Sun once every 366.26 times it rotates about its own axis, which is equal to 365.26 solar days, or one sidereal year.
        <br></br>
        The Earth's axis of rotation is tilted 23.4° away from the perpendicular of its orbital plane, producing seasonal variations on the planet's surface with a period of one tropical year (365.24 solar days).
        </div>
    </div>
    
    <div id="moon">
    	<img src="images/moon.png" width="15" height="15" id="moon_image"/>
    </div>
    
	<div id="mercury" width="40" height="40">
    	<img src="images/mercury.png"id="mercury_image"/>
		<div id="info">
        Mercury is the innermost of the eight planets in the Solar System. It is also the smallest, and its orbit has the highest eccentricity of the eight.
        
        <br></br>
        It orbits the Sun once in about 88 Earth days, completing three rotations about its axis for every two orbits. Mercury has the smallest axial tilt of the Solar System planets.
        </div>
		<div id="amount"></div>
		<div id="slider" ></div>
    </div>
    
	<div id="venus" width="60" height="60">
    	<img src="images/venus.png"id="venus_image"/>
		<div id="info">
        The diameter of Venus is 12,092 km (only 650 km less than the Earth's) and its mass is 81.5% of the Earth's. Conditions on the Venusian surface differ radically from those on Earth, owing to its dense carbon dioxide atmosphere.
        
        <br></br>
        The mass of the atmosphere of Venus is 96.5% carbon dioxide, with most of the remaining 3.5% being nitrogen.
        </div>
		<div id="amount"></div>
		<div id="slider" ></div>
    </div>
	<div id="sun" width="100" height="100" >
		<img src="images/sun.png" id="sun_image"/>
		<div id="amount"></div>
		<div id="slider" ></div>
        <div id="info">
        The Sun is the star at the center of the Solar System. It is almost perfectly spherical and consists of hot plasma interwoven with magnetic fields.
        
        <br></br>
        It has a diameter of about 1,392,684 km, about 109 times that of Earth, and its mass (about 2×1030 kilograms, 330,000 times that of Earth) accounts for about 99.86% of the total mass of the Solar System.
		</div>
</div>

<br></br>

<div id="sidebar">
<table frame="vsides" id="infotable">
		<tr id="infoheader">
			<td>Name</td>
			<td>Density(*10^12 kg/km³</td>
			<td>Volume(*10^11 km³)</td>
			<td>Mass (*10^23 kg)</td>
			<td>Velocity(km/s)</td>
		</tr>
		<tr id="sundata">
			<td>Sun</td>
			<td id="density">1.41</td>
			<td id="volume">1409000</td>
			<td id="mass">19889200</td>
			<td id="speed">N/A</td>
		</tr>
		<tr id="earthdata">
			<td>Earth</td>
			<td id="density">5.52</td>
			<td id="volume">10.8</td>
			<td id="mass">59.7</td>
			<td id="speed">29.09</td>
		</tr>
		<tr id="mercurydata">
			<td>Mercury</td>
			<td id="density">5.42</td>
			<td id="volume">0.608</td>
			<td id="mass">3.30</td>
			<td id="speed">47.75</td>
		</tr>
		<tr id="venusdata">
			<td>Venus</td>
			<td id="density">5.03</td>
			<td id="volume">9.28</td>
			<td id="mass">16.6</td>
			<td id="speed">34.94</td>
		</tr>
</table>
</div>



</div>""")

        quiz_name = self.request.get("quiz_name")
        #global score
        #score = 3
        global quiz_type
        quiz_type = "after"
        
        self.response.out.write("""
      <form action="/?%s" method="get">
        <input type="submit" value="I'm done!" id="done">
      </form>
      %s

      <button id="pause"><img src="images/pause.png"/></button>
    </body>
    </html>""" % (urllib.urlencode({'quiz_name': quiz_name}),
                      cgi.escape(quiz_name)))

        self.response.out.write("""
<br>
<div id="menu">
<!--
<label for="radius_slider" id="radius">Radius: </label>
<input type="range" name="radius_slider" id="radius_slider" value="100" min="80" max="200" data-theme="a" data-track-theme="b"/>
<input type="button" id="done" name="done" value="Done" onClick="done()">
-->

<!--
Credits:
http://en.wikipedia.org/wiki/Sun
http://en.wikipedia.org/wiki/Earth
http://en.wikipedia.org/wiki/Mercury_(planet)
http://en.wikipedia.org/wiki/Venus
-->

</body>

</html>
                                """)

class MainHandler(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()

        global quiz_type

        if user:
            if quiz_type == "before":
                global score
                score = "2"
                
            quiz_name = self.request.get("quiz_name")
            
            self.response.out.write("""
<!DOCTYPE html>

<head>
<title>Diagnostic Quiz</title>

<link rel="stylesheet" type="text/css" href="css/quiz_stylesheet.css"/>

<script type="text/javascript">
function redirect()
{""")
            if quiz_type == "before":
                self.response.out.write("""document.body.innerHTML += '<form id="dynForm" action="./submit?quiz_name=" method="post"><input type="hidden" name="q" value="a"></form>';""")
            else:
                self.response.out.write("""document.body.innerHTML += '<form id="dynForm" action="./orbit" method="get"><input type="hidden" name="q" value="a"></form>';""")

            self.response.out.write("""
        document.getElementById("dynForm").submit();
}

function finish() {
	var n=0;
	if(quiz.question_1[2].checked){
		n++;}
	if(quiz.question_2[2].checked){
		n++;}
	if(quiz.question_3[1].checked){
		n++;}""")

            reply = "You got '+n+' question(s) correct!"

            if quiz_type == "after":
                reply = "You got '+n+' question(s) correct this time."

            self.response.out.write("alert('" + reply + "')")
            self.response.out.write("""
	setTimeout('redirect()', 10);
}
</script>
</head>

<body>
""")
            self.response.out.write("<p id='welcome'>Hello " + user.nickname() + "!</p>")
            self.response.out.write("<br></br>")
            self.response.out.write("""
    <form action="/login" method="post">
        <input type="button" id="logout" onClick="window.location.href='%s'" value="Logout" />
    </form>
</div>
    """ % users.create_logout_url(self.request.uri))
	
            if quiz_type == "before":
                self.response.out.write("""
<div align="center">
				Hello! Welcome to DHS Gravitation.
<br>
                                        Before we start, please take a simple quiz to gauge your knowledge in the area of gravitation.</div>""")
            
            self.response.out.write("""
<!-- begin quiz html -->
<div align="center">
<br><br><br>
<form name="quiz">
<fieldset style="width:300px;">
<legend><strong>Which variable affects the orbital speed of planets most significantly?</strong> </legend>
<input name="question_1" type="radio" value="0"> Mass of planets
<br>
<input name="question_1" type="radio" value="0"> Shape of planets
<br>
<input name="question_1" type="radio" value="1"> Mass of the sun
</fieldset>
<br /><br /><fieldset style="width:300px;">
<legend><strong>Which planet below has the longest period of revolution around the sun?</strong> </legend>
<input name="question_2" type="radio" value="0"> Mercury
<br>
<input name="question_2" type="radio" value="0"> Venus
<br>
<input name="question_2" type="radio" value="1"> Earth
</fieldset>
<br /><br /><fieldset style="width:300px;">
<legend><strong>What is the equation to calculate the speed of revolution of a planet?</strong> </legend>
<input name="question_3" type="radio" value="0"> v = √(GM/r)
<br>
<input name="question_3" type="radio" value="0"> v = 2(√GM)/r^2
<br>
<input name="question_3" type="radio" value="1"> v = s/t
</fieldset>
<br /><br /> <INPUT TYPE="submit" value="Finish" onClick="finish()">
 <INPUT TYPE="reset" value="Reset" >
</form>
<!-- end quiz html -->
</div>
""")
        else:
            self.response.out.write("""
<!DOCTYPE html>

<head>
<title>Diagnostic Quiz</title>

<link rel="stylesheet" type="text/css" href="css/quiz_stylesheet.css"/>
</head>

<body>""")

            self.response.out.write("""
<div align="center">
    <form action="/login" method="post">
        <input type="button" onClick="window.location.href='%s'" value="Login" />
    </form>
</div>
    """ % users.create_login_url(self.request.uri))

        self.response.out.write("""</body>
</html>""")
        
app = webapp2.WSGIApplication([('/', MainHandler),
                               ('/orbit', Orbit),
                               ('/submit', Quiz)],
                              debug=True)
