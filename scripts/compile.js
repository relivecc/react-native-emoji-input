import _ from "lodash";
import fs from "fs";

import {
  category,
  categoryIndexMap,
  emojiLib,
  emojiMap,
  emojiArray,
} from "../src/emoji-data";

let data = {
  category,
  categoryIndexMap,
  emojiLib,
  emojiMap,
  emojiArray,
};

var stingified = JSON.stringify(data)
  .replace(/(["'])require(?:(?=(\\?))\2.)*?\1/g, (value) =>
    value.replace(/"/g, "")
  )
  .replace(/[\u007F-\uFFFF]/g, function (chr) {
    return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4);
  });

fs.writeFile(
  "src/emoji-data/compiled.js",
  `module.exports = ${stingified}`,
  (err) => {
    if (err) throw err;
  }
);
