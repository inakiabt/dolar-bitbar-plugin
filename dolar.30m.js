#!/usr/bin/env node

"use strict";

var dolarblue = require("dolar-blue");
var _ = require("underscore");
var moment = require("moment");

function getDate(date) {
  return moment(date).format("YYYY-MM-DD HH:mm");
}

// function printSource(source) {
//     console.log('$' + source.value_buy.toFixed(2) + ' / $' + source.value_avg.toFixed(2) + ' / $' + source.value_sell.toFixed(2), '-', getDate(source.date), source.source);
// }
function printSource(source) {
  console.log(
    "$" +
      source.value_buy.toFixed(2) +
      " / $" +
      source.value_avg.toFixed(2) +
      " / $" +
      source.value_sell.toFixed(2),
    "-",
    getDate(source.date),
    source.source
  );
}

dolarblue({ src: "Bluelytics" }, function (err, data) {
  if (err) {
    console.error(err);
    console.error("err | color=red");
    process.exit(1);
    return;
  }

  if (!data) {
    console.error("err | color=red\nError: No internet?");
    process.exit(1);
    return;
  }

  var list = [
    "oficial",
    "blue",
    "ambito_financiero",
    "oficial_euro",
    "blue_euro",
  ];

  console.log("💵");
  console.log("---");
  _.each(
    list
      .filter(function (item) {
        return !!data[item];
      })
      .map(function (item) {
        return data[item];
      }),
    printSource
  );
});
