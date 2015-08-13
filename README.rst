**********************
Play video on Dreambox
**********************

Firefox__ browser addon (extension) that adds a "Play on Dreambox" button to the
toolbar.
Pressing it plays the video of the current tab on your Dreambox__ satellite
receiver.

Works fine with a Dreambox `DM7080 HD`__.

You can also right-click a link to a video page and select
"Play linked video on Dreambox".
That way you don't even need to open video detail pages.

__ https://www.mozilla.org/firefox
__ http://www.dream-multimedia-tv.de/products
__ http://www.dream-multimedia-tv.de/dm7080-hd

.. contents::


Features
========
- Toolbar button to play the video on the current page
- Context menu item to play the video on the linked page.
  Nice for video lists; no need to access the detail page anymore.
- Dreambox web interface access token support
- Supports hundreds of video sites, see the `youtube-dl site support list`__.
- Errors are displayed via the operating system's notification system

__ http://rg3.github.io/youtube-dl/supportedsites.html


Configuration options
=====================
In the addons manager

youtube-dl path
  Full path to the ``youtube-dl`` executable, e.g. ``/usr/bin/youtube-dl``
Dreambox IP/host name
  IP address of your dreambox satellite receiver, e.g. ``192.168.1.21``


Dependencies
============
``youtube-dl``
  for video URL extraction.

  Installable on a standard Debian/Ubuntu system via::

    $ apt-get install youtube-dl

  https://github.com/rg3/youtube-dl
Dreambox extensions
  The following extensions have to be installed on your Dreambox:

  - Media Player (``enigma2-plugin-extensions-mediaplayer``)
  - Webinterface (``enigma2-plugin-extensions-webinterface``)


License
=======
``playVideoOnDreambox`` is licensed under the `GPL v3`__ or later.

__ http://www.gnu.org/licenses/gpl.html


Homepage
========
Web site
  http://cweiske.de/playVideoOnDreambox.htm
Source code
  http://git.cweiske.de/playVideoOnDreambox.git

  Mirror: https://github.com/cweiske/playVideoOnDreambox
Firefox Add-ons site
  https://addons.mozilla.org/de/firefox/addon/play-video-on-dreambox/
Dreambox forum thread
  http://www.dream-multimedia-tv.de/board/index.php?page=Thread&threadID=20224


Author
======
Written by Christian Weiske, cweiske@cweiske.de


Alternatives
============
- `MovieStreamer v1.3 - Internet-Filme auf der Box abspielen.`__

__ http://www.dream-multimedia-tv.de/board/index.php?page=Thread&threadID=17776
