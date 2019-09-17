import _, { filter, includes } from "lodash";
import emoji from "./emoji-data.json";
import emojiSynonyms from "./emojiSynonyms.json";
import userInputEmojiSynonyms from "./userInputtedSynonyms.json";
import duplicates from "./duplicates.json";

interface IEmoji {
  name: string;
  unified: string;
  non_qualified: string;
  docomo: string;
  au: string;
  softbank: string;
  google: string;
  image: string;
  sheet_x: number;
  sheet_y: number;
  short_name: string;
  short_names: string[];
  text: string | null;
  texts: string | null;
  category: string;
  sort_order: number;
  added_in: string;
  has_img_apple: boolean;
  has_img_google: boolean;
  has_img_twitter: boolean;
  has_img_facebook: boolean;
  has_img_messenger: boolean;
  obsoletes?: string;
}

const filteredEmoji = filter(
  emoji as IEmoji[],
  e => !includes(duplicates, e.unified)
);

const categoryTitleToKey: any = {
  "Frequently Used": "fue",
  "Smileys & People": "people",
  "Animals & Nature": "animals_and_nature",
  "Food & Drink": "food_and_drink",
  Activities: "activity",
  "Travel & Places": "travel_and_places",
  Objects: "objects",
  Symbols: "symbols",
  Flags: "flags"
};

let obsoletes = _(filteredEmoji)
  .filter("obsoletes")
  .map(v => v.obsoletes)
  .value();

// // Adding in extra duplicates not marked in datasource
obsoletes.push.apply(obsoletes, ["1F93D", "1F93E", "1F939", "1F938", "1F939"]);

let emojiLib = _(filteredEmoji)
  // .filter(e => !obsoletes.includes(e.unified))
  .sortBy("sort_order")
  .mapKeys(({ short_name }) => short_name)
  .mapValues(v => ({
    char: String.fromCodePoint.apply(
      null,
      (v.unified as any).split("-").map((v: any) => `0x${v}`)
    ),
    key: v.short_name,
    keywords: [v.short_name, v.name ? v.name : ""],
    category: categoryTitleToKey[v.category],
    lib: v
  }))
  .value();

const category = [
  {
    key: "fue",
    title: "Frequently Used"
  },
  {
    key: "people",
    title: "Smileys & People"
  },
  {
    key: "animals_and_nature",
    title: "Animals & Nature"
  },
  {
    key: "food_and_drink",
    title: "Food & Drink"
  },
  {
    key: "activity",
    title: "Activities"
  },
  {
    key: "travel_and_places",
    title: "Travel & Places"
  },
  {
    key: "objects",
    title: "Objects"
  },
  {
    key: "symbols",
    title: "Symbols"
  },
  {
    key: "flags",
    title: "Flags"
  }
];

const categoryIndexMap = _(category)
  .map((v, idx) => ({ ...v, idx }))
  .keyBy("key")
  .value();

_.each(emojiSynonyms, (v, k) => {
  emojiSynonyms[k] = _.uniq(emojiSynonyms[k].concat(userInputEmojiSynonyms[k]));
});

const emojiMap = _(emojiLib)
  .mapValues(
    (v, k) =>
      k +
      " " +
      v.keywords.map(v => v.replace(/_/g, " ")).join(" ") +
      (emojiSynonyms[k] || []).map(v => v.replace(/_/g, " ")).join(" ")
  )
  .invert()
  .value();

const emojiArray = _.keys(emojiMap);

export { category, categoryIndexMap, emojiLib, emojiMap, emojiArray };
