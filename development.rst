*****************
Development hints
*****************

Commands
========
``firefox -P dev``
  Start firefox development profile
``../node_modules/.bin/jpm watchpost --post-url http://localhost:8888/``
  Automatically re-build ``.xpi`` file and install it in Firefox
``../node_modules/.bin/jpm xpi``
  Build a new version. Update ``package.json`` before.


URL fetching
============
Fetch video URL::

  $ youtube-dl --get-url https://www.youtube.com/watch?v=BRnPidrKto4


Dreambox
========
API docs: http://dream.reichholf.net/e2web/#mediaplayercurrent

Play video::

  http://192.168.3.42/web/mediaplayerplay?file=4097:0:1:0:0:0:0:0:0:0:http%253a%2F%2Fcweiske.de%2Ftagebuch%2Fimages%2Fkdenlive%2Fkdenlive-lower-third.webm

With the URL, the ``:`` of the ``http://`` is double encoded.

Stop current video and end dreambox mediaplayer::

 $ curl 'http://192.168.3.42/web/mediaplayercmd?command=exit'


Debugging
=========
``about:config``

``extensions.sdk.console.logLevel``
  ``debug``



URLs
====
- https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/jpm#Developing_without_browser_restarts
- https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/console#Logging_Levels
- https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/system_child_process
- https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Adding_a_Button_to_the_Toolbar
- https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/simple-prefs
- https://blog.mozilla.org/addons/2014/06/05/how-to-develop-firefox-extension/
