var assert = require('assert');
var siren = require('siren');

var ROOT_URL = 'http://45.55.169.202:3000/';

describe('Zetta API', function() {
  describe('root', function() {
    it('contains a class named "root"', function(done) {
      siren()
        .load(ROOT_URL)
        .subscribe(function(env) {
          var subject = env.response.body.class;

          assert.equal(subject.length, 1);
          assert.equal(subject[0], 'root');

          done();
        });
    });

    it('contains a link to a server named "bork"', function(done) {
      siren()
        .load(ROOT_URL)
        .subscribe(function(env) {
          var subject = env.response.body.links.filter(function(link) {
            return link.rel.indexOf('http://rels.zettajs.io/server') > -1;
          });

          assert.equal(subject.length, 1);
          assert.equal(subject[0].title, 'bork');

          done();
        });
    });
  });

  describe('bork server', function() {
    it('has a name of "bork"', function(done) {
      siren()
        .load(ROOT_URL)
        .link('http://rels.zettajs.io/server', 'bork')
        .subscribe(function(env) {
          var subject = env.response.body;

          assert.equal(subject.properties.name, 'bork');

          done();
        });
    });

    describe('display device', function(done) {
      it('updates its message on a change request', function(done) {
        var message = 'hello ' + Date.now();

        siren()
          .load(ROOT_URL)
          .link('http://rels.zettajs.io/server', 'bork')
          .entity(function(e) {
            return e.class.indexOf('display') > -1;
          })
          .action('change', function(a) {
            a.set('message', message);
            return a.submit();
          })
          .subscribe(function(env) {
            var subject = env.response.body;

            assert.equal(subject.properties.message, message);

            done();
          });
      });
    });
  });
});
