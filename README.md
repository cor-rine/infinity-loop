# Infinity Loop

VanillaJS HTML game inspired by the iPad game for fun.


### Local Setup
After cloning the repository, you'll want to run `npm install` to download all dependencies.  Go grab a coffee, this might take some time.

After that's done, you can run `gulp dev` to run the development version of the app


### Debug Mode
If you want to work on levels, some query parameters have been built in so that you can go to certain levels, or create your own.

Assuming you're running the app with browserSync per the gulpfile, the query params are as follows:  `http://localhost:3000/?debug=true&level=010`.

When debug is set to true, you'll see console logs in the console, and the level query parameter will allow you to see the completed/unmixed version of the level of your choosing.  It will not run the game in Game mode.