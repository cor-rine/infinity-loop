(function(document, window) {
  'use strict';

  /**
   * CSS Settings that need to come into the JS
   */
  var CSSValues = {
    tileWidth: 72
  };

  var SoundFX = {
    gameComplete: '.js-soundfx-complete'
  };

  /**
   * Tile Types and templates
   */
  var TileTypes = {
    straightLine: {
      svgTemplate: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="72px" height="72px" viewBox="0 -27 72 72" overflow="visible" enable-background="new 0 -27 72 72" xml:space="preserve"> <defs></defs><rect width="72" height="18"/></svg>',
      svgTag: '<embed src="svg/straight-line.svg" type="image/svg+xml"></embed>'
    },
    semiCircle: {
      svgTemplate: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"    x="0px" y="0px" width="72px" height="72px" viewBox="0 0 72 72" overflow="visible" enable-background="new 0 0 72 72" xml:space="preserve"><defs></defs><path d="M45,0c0,0-9,0-18,0C27,27,0,27,0,27v18c0,0,23.101-0.003,36.2-16.557C42.616,37.397,53.506,45,72,45c0,0,0-9,0-18 C45,27,45,0,45,0z"/></svg>',
      svgTag: '<embed src="svg/semi-circle.svg" type="image/svg+xml"></embed>'
    },
    quarterCircle: {
      svgTemplate: '<svg version="1.1"    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"    x="0px" y="0px" width="72px" height="72px" viewBox="0 -27 72 72" overflow="visible" enable-background="new 0 -27 72 72" xml:space="preserve"> <defs> </defs> <path d="M0,0c45,0,45,45,45,45H27c0,0,0-27-27-27C0,9,0,0,0,0z"/> </svg>',
      svgTag: '<embed src="svg/quarter-circle.svg" type="image/svg+xml"></embed>'
    },
    fullCircle: {
      svgTemplate: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"    x="0px" y="0px" width="72px" height="72px" viewBox="0 0 72 72" overflow="visible" enable-background="new 0 0 72 72"   xml:space="preserve"><defs></defs><path fill="none" d="M36.2,28.443c-2.331,2.946-4.978,5.366-7.756,7.357c2.946,2.331,5.366,4.978,7.357,7.756  c2.331-2.945,4.978-5.366,7.756-7.357C40.611,33.869,38.19,31.222,36.2,28.443z"/><path d="M45,0c0,0-9,0-18,0C27,27,0,27,0,27v18c27,0,27,27,27,27s9,0,18,0c0-27,27-27,27-27s0-9,0-18C45,27,45,0,45,0z M35.8,43.557  c-1.991-2.778-4.411-5.426-7.357-7.756c2.778-1.991,5.425-4.411,7.756-7.357c1.991,2.778,4.412,5.425,7.357,7.756  C40.778,38.19,38.131,40.611,35.8,43.557z"/></svg>',
      svgTag: '<embed src="svg/full-circle.svg" type="image/svg+xml"></embed>'
    },
    pegCircle: {
      svgTemplate: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"    x="0px" y="0px" width="72px" height="72px" viewBox="-13.25 -13.25 72 72"    overflow="visible" enable-background="new -13.25 -13.25 72 72" xml:space="preserve"> <defs> </defs><circle fill="none" cx="22.5" cy="22.5" r="9"/> <path d="M58.75,13.75H43.234C39.821,5.67,31.822,0,22.5,0C10.074,0,0,10.074,0,22.5C0,34.926,10.074,45,22.5,45  c9.128,0,16.98-5.439,20.51-13.25h15.74V13.75z M22.5,31.5c-4.971,0-9-4.029-9-9s4.029-9,9-9s9,4.029,9,9S27.471,31.5,22.5,31.5z"/></svg>',
      svgTag: '<embed src="svg/peg-circle.svg" type="image/svg+xml"></embed>'
    },
    blank: {
      svgTemplate: '',
      svgTag: ''
    },
  };

  function Game() {
  }

  Game.prototype = {
    currentLevel: '001',

    start: function() {
      LevelBuilder.resetBoard();
      LevelBuilder.loadLevel(this.currentLevel);
    },

    nextLevel: function() {
      var self = this;

      var level = parseInt(self.currentLevel);
      level++;
      self.currentLevel = pad(level, 3);

      setTimeout(function startNextLevel() {
        self.start();
      }, 3500);
    }
  };

  var game = new Game();

  /**
   * Level Builder to create the levels and control what happens on the board
   */
  var LevelBuilder = {
    board: null,
    
    //   Takes in a board object and creates a board.
    init: function(boardSelector, levelSelector, levelInfo) {
      var self = this;
      
      // Instanciate board
      self.board = new Board(boardSelector, levelSelector, levelInfo.level.length, levelInfo.level[0].length);
      self.board.setTitle(levelInfo.display);
      
      // Iterate over the level and create the board in the DOM
      for (var i = 0; i < levelInfo.level.length; i++) {
        for (var j = 0; j < levelInfo.level[i].length; j++) {

          // Set the board up with a random rotation of the tile if not in debug mode
          if (self.debug) {
            self.board.setTile(i, j, new Tile(levelInfo.level[i][j].tile, TileTypes[levelInfo.level[i][j].tile], levelInfo.level[i][j].rotation));
          } else {
            self.board.setTile(i, j, new Tile(levelInfo.level[i][j].tile, TileTypes[levelInfo.level[i][j].tile], Math.ceil(Math.random()*4)*90));
          }

          // Set the solution
          self.board.setSolutionTile(i, j, levelInfo.level[i][j].rotation);
        }
      }

      self.board.renderBoard();
    },

    /**
     * Reset the board
     */
    resetBoard: function() {
      document.querySelector('body').classList.remove('complete');
      if (this.board) {

        this.board.clear();
      }
    },

    /**
     * Load the level
     * @param {string} value of the level to load
     */
    loadLevel: function(levelNum) {
      getJSON(document.location.origin + document.location.pathname + 'js/levels/' + levelNum + '.json', function(data) {
        LevelBuilder.init('.js-board', '.js-level', data);
      });
    }
  };

  /**
   * Initialise the Board for the obstacle.
   * @param {string} selector of the board DOM object
   * @param {int} width of the board in squares
   * @param {int} height of the board in squares
   */
  function Board(selector, levelSelector, width, height) {
    this.el = selector;
    this.width = width;
    this.height = height;
    this.levelEl = levelSelector;

    this.generateBoardMap();
  }

  Board.prototype = {
    tiles: [],
    solution: [],

    /**
     * Helper method to create tiles for the game board
     **/
    generateBoardMap: function() {
      this.tiles = Array(this.width);
      this.solution = Array(this.width);

      for (var i = 0; i < this.width; i++) {
        for (var j = 0; j < this.height; j++) {
          this.tiles[i] = Array(this.height);
          this.solution[i] = Array(this.height);
        }
      }
    },

    // TODO: make this work.
    // checkBoardWinner: function() {
    //   console.log('running check board winner');
    //   if (this.isWinningMove()) {

    //     if (this.debug) {
    //       console.log('winner');
    //     }

    //     document.querySelector('body').classList.add('complete');
    //     setTimeout(function playSound() {
    //       document.querySelector(SoundFX.gameComplete).play();
    //     }, 300);
    //     game.nextLevel();
    //   }
    // },

    /**
     * Helper method to clear the tiles
     **/
    clear: function() {
      this.tiles = [];
      this.solution = [];
      
      var board = document.querySelector(this.el);

      // TODO: make this work.
      // board.removeEventListener('click', );
    },

    /**
     * Initialise the DOM for the obstacle.
     * @param {number} xVal
     * @param {number} yVal
     * @param {number} rotation to set at that tile value
     */
    setSolutionTile: function(xVal, yVal, rotation) {
      this.solution[xVal][yVal] = rotation;
    },

    /**
     * Initialise the DOM for the obstacle.
     * @param {number} xVal
     * @param {number} yVal
     * @param {Obj} tile to set at that value
     */
    setTile: function(xVal, yVal, tile) {
      this.tiles[xVal][yVal] = tile;
    },

    /**
     * Initialise the DOM for the obstacle.
     * @param {string} title of the level
     */
    setTitle: function(title) {
      this.title = title;
    },

    /**
     * Returns the tile at the given location
     * @param {number} xVal
     * @param {number} yVal
     */
    getTile: function(xVal, yVal) {
      return this.tiles[xVal][yVal];
    },

    /**
     * Renders the board
     */
    renderBoard: function() {
      var self = this;

      var board = document.querySelector(self.el);
      var levelDisplay = document.querySelector(self.levelEl);

      // Clear board and reset classname
      board.innerHTML = '';
      document.querySelector('body').className = '';

      for (var i = 0; i < self.tiles.length; i++) {
        for (var j = 0; j < self.tiles[i].length; j++) {
          self.getTile(i, j).renderSVGTile(board);
        }
      }

      levelDisplay.innerHTML = self.title;
      
      board.style.width = CSSValues.tileWidth * self.tiles[0].length + 'px';

      // TODO: make this actually work with a function reference
      board.addEventListener('click', self.clickFunction);

      // board.addEventListener('click', function() {
      //   console.log(self);

      //   if (self.isWinningMove()) {
      //     if (self.debug) {
      //       console.log('winner');
      //     }

      //     document.querySelector('body').classList.add('complete');
      //     setTimeout(function playSound() {
      //       document.querySelector(SoundFX.gameComplete).play();
      //     }, 300);
      //     game.nextLevel();
      //   }
      // });

    },

    /**
     * Check to see if we have a winner
     */
    isWinningMove: function() {
      var self = this;

      if (self.tiles.length === 0 && self.solution.length === 0) {
        return false;
      }

      // Iterate through the tiles and match against the solution
      for (var i = 0; i < self.tiles.length; i++) {
        for (var j = 0; j < self.tiles[i].length; j++) {
          var tile = self.getTile(i, j);

          if (self.debug) {
            console.log('Solution: ' + self.solution[i][j]);
            console.log('Tile: ' + tile.rotation%360);
          }

          if (typeof self.solution[i][j] === 'object') {
            if (self.solution[i][j][0] !== tile.rotation%360 ||
                self.solution[i][j][1] !== tile.rotation%360) {
              continue;
            }
          }

          else if (self.solution[i][j] !== tile.rotation%360) {
            return false;
          }

        }
      }

      return true;

    },

    clickFunction: function() {
      console.log(this);

      if (self.isWinningMove()) {
        if (self.debug) {
          console.log('winner');
        }

        document.querySelector('body').classList.add('complete');
        setTimeout(function playSound() {
          document.querySelector(SoundFX.gameComplete).play();
        }, 300);
        game.nextLevel();
      }
    },

  };



  /**
   * Initialise a Tile object
   * @param {string} type of tile
   * @param {int} rotation value of tile
   */
  function Tile(name, type, rotation) {
    this.name = name;
    this.type = type;
    this.rotation = rotation;
  }

  Tile.prototype = {

    /**
     * Renders the tile on the board and sets event listener
     */
    renderSVGTile: function(board) {
      var self = this;

      self.el = document.createElement('div');
      self.el.className = 'tile js-tile';

      // Give the child node for the full circle
      self.el.innerHTML = self.type.svgTemplate;

      // Set the rotation of the tiles
      self.el.setAttribute('data-rotation', self.rotation);
      self.el.style.transform = 'rotate(' + self.rotation + 'deg)';

      // Initialize callback listener
      self.el.addEventListener('click', function(event) {

        if (event.isTrusted) {
          self.rotation += 90;

          // Update the view
          self.rotateTile(this, self.rotation);
        }    

      });
      
      board.appendChild(self.el);
      
    },

    /**
     * Rotates the tile
     */
    rotateTile: function(obj, angle) {
      obj.setAttribute('data-rotation', angle);
      obj.style.transform = 'rotate(' + angle + 'deg)';
    }
  };


  /**
   * Placeholder getJSON to get the levels from the json files
   * Not sure if I want to keep this here or not
   */
  var getJSON = function(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);

        callback(data);
      } else {
        // We reached our target server, but it returned an error
        console.error('Error received from the server');
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
      console.error('Connection error');
    };

    request.send();
  };

  /**
   * Query parameters function 
   *
   */
   var getQueryParams = function() {
      var str = window.location.search;
      var objURL = {};

      str.replace(
        new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
        function( $0, $1, $2, $3 ){
          objURL[ $1 ] = $3;
        }
      );
      return objURL;
    };

  // Function to pad string to give it leading zeros
  function pad (str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
  }

  /**
   * Onload start the game and build the level
   * Need to build a level around this to keep score maybeee ... we'll see.
   */
  window.onload = function() {
    // Set debug mode for level building
    var queryParams = getQueryParams();
    var windowHeight = window.innerHeight;

    document.getElementById('body').style.height = windowHeight + "px";

    // Debug Mode
    if (queryParams.debug) {
      LevelBuilder.debug = true;

      if (queryParams.level) {
        LevelBuilder.loadLevel(queryParams.level);
      }
    }

    // Game Mode
    // Not finished yet ...
    if (!queryParams.level) {
      game.start();
    }

  };
})(document, window);