import fs from 'fs';

const rawData = fs.readFileSync('public/data/data.json', 'utf8');
const data = JSON.parse(rawData);

const searchWord = "Brottsplats";

let found = data.filter(row => {
    return row[2] && row[2].toLowerCase() === searchWord.toLowerCase();
});

if (found.length === 0) {
    found = data.filter(row => row[2] && row[2].toLowerCase().includes(searchWord.toLowerCase()));
}

if (found.length > 0) {
    console.log("FOUND_ENTRY_RAW:", JSON.stringify(found[0]));
    found[0].forEach((val, idx) => console.log(`Index ${idx}: "${val}"`));
} else {
    console.log("NOT_FOUND");
}
