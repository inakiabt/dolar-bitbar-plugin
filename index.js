'use strict';

var dolarblue = require('dolar-blue');
var _ = require('underscore');

function getDate(date) {
    return date;
    // var d = new Date(date);
    // return d.getDate() + '/' + (d.getMonth()+1) + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
}

function printSource(source) {
    console.log('$' + source.value_buy.toFixed(2) + '/$' + source.value_sell.toFixed(2), getDate(source.date), source.source);
}

dolarblue({src: "Bluelytics"}, function (err, data) {
    if (err) {
        console.error("Error: ", err);
        return;
    }

    var sources = _.groupBy(data.data, function(s) {
        return s.source === 'oficial' ? 'oficial' : 'resto';
    });

    if (!sources.oficial) {
        console.log('-/-');
    } else {
        printSource(_.first(sources.oficial));
    }
    _.each(sources.resto, printSource);
});