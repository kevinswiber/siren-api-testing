var Rx = require('rx');
var siren = require('siren');

module.exports = function() {
  this.Given(/^I am an API consumer of (.+)$/i, function(rootUrl) {
    this.rootUrl = rootUrl;
  });

  this.When(/^I access the root URL/i, function() {
    this.current = siren()
      .load(this.rootUrl);
  });

  this.Then(/^I should see a class with a "([^"]*)" value$/, function (className, callback) {
    this.ensureReplayable();

    this.current
      .subscribe(function(env) {
        if (env.response.statusCode !== 200) {
          callback(new Error('Invalid response code.'));
          return;
        }

        var classes = env.response.body.class;

        if (!classes || !classes.length) {
          callback(new Error('Invalid response class.'));
          return;
        }

        if (classes.indexOf(className) > -1) {
          callback();
        } else {
          callback(new Error('Response is missing a class named', className));
        }
      });
  });

  this.Then(/^I should see a link to a (.+) named "([^"]+)"/,
      function(relation, title, callback) {
    this.ensureReplayable();

    if (!this.relationMap.hasOwnProperty(relation)) {
      callback(new Error('Invalid relation type.'));
      return;
    }

    var rel = this.relationMap[relation];

    this.current
      .subscribe(function(env) {
        if (env.response.statusCode !== 200) {
          callback(new Error('Invalid response code.'));
          return;
        }

        var links = env.response.body.links;

        if (!links || !links.length) {
          callback(new Error('Invalid response links.'));
          return;
        }

        var filtered = links.filter(function(link) {
          return link.rel.indexOf(rel) > -1 && link.title === title;
        });

        if (!filtered.length) {
          callback(new Error('Unable to find link with relation ' + rel
              + ' and title "' + title + '"'));
          return;
        }

        callback();
      });
  });

  this.When(/^I go to a (.+) link named "([^"]*)"$/,
      function(relation, title, callback) {
    if (!this.relationMap.hasOwnProperty(relation)) {
      callback(new Error('Invalid relation type.'));
      return;
    }

    var rel = this.relationMap[relation];
    this.current = this.current
      .link(rel, title);

    callback();
  });

  this.When(/^I go to a "([^"]*)" device$/, function(deviceType) {
    this.current = this.current
      .entity(function(e) {
        return e.properties.type === deviceType;
      });
  });

  this.When(/^I execute the "([^"]*)" action with input values:$/,
      function(actionName, table) {
    this.current = this.current
      .action(actionName, function(a) {
        table.rows().forEach(function(row) {
          a.set(row[0], row[1]);
        });

        return a.submit();
      });
  });

  this.Then(/^I should see the following properties:$/, function(table, callback) {
    this.ensureReplayable();

    this.current
      .subscribe(function(env) {
        if (env.response.statusCode !== 200) {
          callback(new Error('Invalid response code.'));
          return;
        }

        var properties = env.response.body.properties;

        if (!properties) {
          callback(new Error('Missing response properties.'));
          return;
        }

        var keys = Object.keys(properties);
        table.rows().forEach(function(row) {
          if (keys.indexOf(row[0]) === -1) {
            callback(new Error('Missing property: ', key));
            return;
          }

          if (properties[row[0]] != row[1]) {
            callback(new Error('Response property ' + row[0]
                + ' contains invalid value ' + properties[row[0]]));
            return;
          }
        });

        callback();
      });
  });
};
