EPIC PORTRAIT GENERATOR

My first full stack web application built in Oct '14. Oddly it is a CRUD app built with Node. Nonetheless it's one of my favorite projects to date.

Features

* Login/authentication/flash messages with Passport/bcrypt
* JQuery-animated form where users customize an epic portrait
* Image uploading (hosted via Imgur API)
* Home screen with user's portraits listed; sidebar with 'recently added' portraits made by others
* Draggable elements on portraits. Portraits can then be saved as a single image via conversion to JavaScript Canvas.
* Share on Facebook

Models

* User: username, password; hasMany Photos
* Photo: background, animal, itemone, itemtwo, img (all strings); belongsTo User
