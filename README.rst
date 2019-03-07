*************************************
playVideoOnDreambox Firefox extension
*************************************

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


Dependencies
============
You need to have the playVideoOnDreamboxProxy software running in your
network.
It will do the heavy lifting of extracting the video URL from the website
and sending it to the dreambox.

This browser extension only sends the current tab URL to this proxy service.

In the extension settings, configure the proxy URL (it ends with ``play.php``).


License
=======
``playVideoOnDreambox`` is licensed under the `GPL v3`__ or later.

__ http://www.gnu.org/licenses/gpl.html


Homepage
========
Web site
  http://cweiske.de/playVideoOnDreambox.htm#firefox
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
