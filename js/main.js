/**
 * CSS Settings that need to come into the JS
 */
var CSSValues = {
  tileWidth: 72
}

/**
 * Tile Types and templates
 */
var TileTypes = {
  straightLine: {
    classNames: 'tile straight-line js-tile',
    svgTemplate: '<embed src="svg/straight-line.svg" type="image/svg+xml"></embed>'
  },
  semiCircle: {
    classNames: 'tile semi-circle js-tile',
    svgTemplate: '<embed src="svg/semi-circle.svg" type="image/svg+xml"></embed>'
  },
  quarterCircle: {
    classNames: 'tile quarter-circle js-tile',
    svgTemplate: '<embed src="svg/quarter-circle.svg" type="image/svg+xml"></embed>'
  },
  fullCircle: {
    classNames: 'tile full-circle js-tile',
    svgTemplate: '<embed src="svg/full-circle.svg" type="image/svg+xml"></embed>'
  },
  pegCircle: {
    classNames: 'tile peg-circle js-tile',
    svgTemplate: '<embed src="svg/peg-circle.svg" type="image/svg+xml"></embed>'
  }
};

/**
 * Level Builder to create the levels and control what happens on the board
 */
var LevelBuilder = {
  board: null,
  
  //   Takes in a board object and creates a board.
  init: function(selector, level) {
    var _this = this;
    
    // Instanciate board
    _this.board = new Board(selector, level.length, level[0].length);
    
    // Iterate over the level and create the board in the DOM
    for (var i = 0; i < level.length; i++) {
      for (var j = 0; j < level[i].length; j++) {

        // Set the board up with a random rotation of the tile
        _this.board.setTile(i, j, new Tile(level[i][j].tile, TileTypes[level[i][j].tile], Math.ceil(Math.random()*4)*90));

        // Set the solution
        _this.board.setSolutionTile(i, j, level[i][j].rotation);
      }
    }

    _this.board.renderBoard();
  }
};


/**
 * Initialise the Board for the obstacle.
 * @param {string} selector of the board DOM object
 * @param {int} width of the board in squares
 * @param {int} height of the board in squares
 */
function Board(selector, width, height) {
  this.el = selector;
  this.width = width;
  this.height = height;

  this.generateBoardMap();
}

Board.prototype = {
  tiles: [],

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
    var _this = this;

    var board = document.querySelector(_this.el);

    for (var i = 0; i < _this.tiles.length; i++) {
      for (var j = 0; j < _this.tiles[i].length; j++) {
        var tile = _this.getTile(i, j).renderSVGTile(board);
      }
    }
    
    board.style.width = CSSValues.tileWidth * _this.tiles.length + 'px';

    board.addEventListener('click', function() {
      if (_this.isWinningMove()) {
        console.log('winner');
        board.className += ' complete';
      };
    });

  },

  /**
   * Check to see if we have a winner
   */
  isWinningMove: function() {
    var _this = this;

    // Iterate through the tiles and match against the solution
    for (var i = 0; i < _this.tiles.length; i++) {
      for (var j = 0; j < _this.tiles[i].length; j++) {
        var tile = _this.getTile(i, j);

        console.log('Solution: ' + _this.solution[i][j]);
        console.log('Tile: ' + tile.rotation%360);

        if (typeof _this.solution[i][j] === 'object') {
          if (_this.solution[i][j][0] !== tile.rotation%360 ||
              _this.solution[i][j][1] !== tile.rotation%360) {
            continue;
          }
        }

        else if (_this.solution[i][j] !== tile.rotation%360) {
          return false;
        }

      }
    }

    return true;

  }

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
  renderTile: function(board) {
    var _this = this;

    _this.el = document.createElement('div');
    _this.el.className = _this.type.classNames;

    // Give the child node for the full circle
    if (_this.name === 'fullCircle') {
      _this.el.innerHTML = _this.type.childNodeTemplate;
    }

    // Set the rotation of the tiles
    _this.el.setAttribute('data-rotation', _this.rotation);
    _this.el.style.transform = 'rotate(' + _this.rotation + 'deg)';

    // Initialize callback listener
    _this.el.addEventListener('click', function() {

      _this.rotation += 90;

      // Update the view
      _this.rotateTile(this, _this.rotation);

    });
    
    board.appendChild(_this.el);
    
  },

  /**
   * Renders the tile on the board and sets event listener
   */
  renderSVGTile: function(board) {
    var _this = this;

    _this.el = document.createElement('div');
    _this.el.className = 'tile js-tile';

    // Give the child node for the full circle
    _this.el.innerHTML = _this.type.svgTemplate;

    // Set the rotation of the tiles
    _this.el.setAttribute('data-rotation', _this.rotation);
    _this.el.style.transform = 'rotate(' + _this.rotation + 'deg)';

    // Initialize callback listener
    _this.el.addEventListener('click', function() {

      _this.rotation += 90;

      // Update the view
      _this.rotateTile(this, _this.rotation);

    });
    
    board.appendChild(_this.el);
    
  },

  /**
   * Rotates the tile
   */
  rotateTile: function(obj, angle) {

    obj.setAttribute('data-rotation', angle);

    obj.style.transform = 'rotate(' + angle + 'deg)';

  }
}


/**
 * Placeholder getJSON to get the levels from the json files
 * Not sure if I want to keep this here or not
 */
getJSON = function(url, callback) {
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
}


/**
 * Onload start the game and build the level
 * Need to build a level around this to keep score maybeee ... we'll see.
 */
window.onload = function() {

  getJSON(document.location + 'js/levels/2.json', function(data) {
    LevelBuilder.init('.js-board', data.level);
  });

};