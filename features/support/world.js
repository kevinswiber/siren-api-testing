var Rx = require('rx');

function World() {
  this.rootUrl = null;
  this.current = null;
  this.relationMap = {
    'server': 'http://rels.zettajs.io/server'
  };
};

World.prototype.ensureReplayable = function() {
  if (!(this.current instanceof Rx.ReplaySubject)) {
    var replay = new Rx.ReplaySubject();
    this.current.subscribe(replay);
    this.current = replay;
  }
};

module.exports = function() {
  this.World = World;
};
