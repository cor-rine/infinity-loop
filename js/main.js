var CSSValues = {
  tileWidth: 72
}

var TileTypes = {
  straightLine: {
    classNames: 'tile straight-line js-tile',
    svgTemplate: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/" x="0px" y="0px" width="72px" height="72px" viewBox="0 -27 72 72" overflow="visible" enable-background="new 0 -27 72 72" xml:space="preserve"> <defs></defs><rect width="72" height="18"/></svg>'
  },
  semiCircle: {
    classNames: 'tile semi-circle js-tile',
    svgTemplate: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"    x="0px" y="0px" width="72px" height="72px" viewBox="0 0 72 72" overflow="visible" enable-background="new 0 0 72 72" xml:space="preserve"><defs></defs><path d="M45,0c0,0-9,0-18,0C27,27,0,27,0,27v18c0,0,23.101-0.003,36.2-16.557C42.616,37.397,53.506,45,72,45c0,0,0-9,0-18 C45,27,45,0,45,0z"/></svg>'
  },
  quarterCircle: {
    classNames: 'tile quarter-circle js-tile',
    svgTemplate: '<svg version="1.1"    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"    x="0px" y="0px" width="72px" height="72px" viewBox="0 -27 72 72" overflow="visible" enable-background="new 0 -27 72 72" xml:space="preserve"> <defs> </defs> <path d="M0,0c45,0,45,45,45,45H27c0,0,0-27-27-27C0,9,0,0,0,0z"/> </svg>'
  },
  fullCircle: {
    classNames: 'tile full-circle js-tile',
    svgTemplate: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"    x="0px" y="0px" width="72px" height="72px" viewBox="0 0 72 72" overflow="visible" enable-background="new 0 0 72 72"   xml:space="preserve"><defs></defs><path fill="none" d="M36.2,28.443c-2.331,2.946-4.978,5.366-7.756,7.357c2.946,2.331,5.366,4.978,7.357,7.756  c2.331-2.945,4.978-5.366,7.756-7.357C40.611,33.869,38.19,31.222,36.2,28.443z"/><path d="M45,0c0,0-9,0-18,0C27,27,0,27,0,27v18c27,0,27,27,27,27s9,0,18,0c0-27,27-27,27-27s0-9,0-18C45,27,45,0,45,0z M35.8,43.557  c-1.991-2.778-4.411-5.426-7.357-7.756c2.778-1.991,5.425-4.411,7.756-7.357c1.991,2.778,4.412,5.425,7.357,7.756  C40.778,38.19,38.131,40.611,35.8,43.557z"/></svg>'
  },
  pegCircle: {
    classNames: 'tile peg-circle js-tile',
    svgTemplate: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:a="http://ns.adobe.com/AdobeSVGViewerExtensions/3.0/"    x="0px" y="0px" width="72px" height="72px" viewBox="-13.25 -13.25 72 72"    overflow="visible" enable-background="new -13.25 -13.25 72 72" xml:space="preserve"> <defs> </defs><circle fill="none" cx="22.5" cy="22.5" r="9"/> <path d="M58.75,13.75H43.234C39.821,5.67,31.822,0,22.5,0C10.074,0,0,10.074,0,22.5C0,34.926,10.074,45,22.5,45  c9.128,0,16.98-5.439,20.51-13.25h15.74V13.75z M22.5,31.5c-4.971,0-9-4.029-9-9s4.029-9,9-9s9,4.029,9,9S27.471,31.5,22.5,31.5z"/></svg>'
  }
};

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
        _this.board.setTile(i, j, new Tile(level[i][j].tile, TileTypes[level[i][j].tile], level[i][j].rotation));
      }
    }

    _this.board.renderBoard();
  },

  setSolution: function(solution) {
    this.board.addSolution(solution);
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

    for (var i = 0; i < this.width; i++) {
      for (var j = 0; j < this.height; j++) {
        this.tiles[i] = Array(this.height);
      }
    }
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
   * Add the solution to the board
   */
  addSolution: function(solution) {
    this.solution = solution;
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

        // console.log('Solution: ' + _this.solution[i][j]);
        // console.log('Tile: ' + tile.rotation%360);

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


getJSON = function(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
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


window.onload = function() {

  getJSON(document.location + 'js/levels/1.json', function(data) {
    LevelBuilder.init('.js-board', data.level);
  });

  getJSON(document.location + 'js/solutions/1.json', function(data) {
    LevelBuilder.setSolution(data.map);
  });

};