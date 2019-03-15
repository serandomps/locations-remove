var dust = require('dust')();
var serand = require('serand');
var utils = require('utils');
var locations = require('locations-findone');

dust.loadSource(dust.compile(require('./template'), 'locations-remove'));

var remove = function (id, done) {
    $.ajax({
        method: 'DELETE',
        url: utils.resolve('accounts:///apis/v/locations/' + id),
        dataType: 'json',
        success: function (data) {
            done(null, data);
        },
        error: function (xhr, status, err) {
            done(err || status || xhr);
        }
    });
};

var findOne = function (id, done) {
    $.ajax({
        method: 'GET',
        url: utils.resolve('accounts:///apis/v/locations/' + id),
        dataType: 'json',
        success: function (data) {
            done(null, data);
        },
        error: function (xhr, status, err) {
            done(err || status || xhr);
        }
    });
};

module.exports = function (ctx, container, options, done) {
    var sandbox = container.sandbox;
    findOne(options.id, function (err, contact) {
        if (err) {
            return done(err);
        }
        dust.render('locations-remove', contact, function (err, out) {
            if (err) {
                return done(err);
            }
            var el = sandbox.append(out);
            var id = options.id;
            $('.remove', el).on('click', function () {
                remove(id, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                    serand.redirect('/locations');
                });
            });
            locations(ctx, {
                id: container.id,
                sandbox: $('.locations', sandbox)
            }, contact, function (err, clean) {
                if (err) {
                    return done(err);
                }
                done(null, function () {
                    clean();
                });
            });
        });
    });
};
