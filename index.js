'use strict';

var dolarblue = require('dolar-blue');
var _ = require('underscore');
var moment = require('moment');

function getDate(date) {
    return moment(date).format('YYYY-MM-DD HH:mm');
}

function printSource(source) {
    const middle = (source.value_sell + source.value_buy) / 2;
    console.log('$' + source.value_buy.toFixed(2) + ' / $' + middle.toFixed(2) + ' / $' + source.value_sell.toFixed(2), '-', getDate(source.date), source.source);
}

dolarblue({src: "Bluelytics"}, function (err, data) {
    if (err) {
        console.error("Error:", err);
        return;
    }

    if (!data) {
        console.error("Error: No internet?");
        return;
    }

    var sources = _.groupBy(data.data, function(s) {
        return s.source === 'oficial' ? 'oficial' : 'resto';
    });

    var list = ['oficial', 'blue', 'ambito_financiero', 'oficial_euro', 'blue_euro'];

    _.each(list.map(function(item) {
      return data[item];
    }), printSource);

    _.each(Object.keys(data).filter(function(item) {
      return !list.includes(item);
    }).map(function(item) {
      return data[item];
    }), printSource);
});
