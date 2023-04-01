interface ConversionDictionary {
    [key: string]: string;
}

const romajiDict: ConversionDictionary = {
    ".": "ten",
    "0": "zero",
    "1": "ichi",
    "2": "ni",
    "3": "san",
    "4": "yon",
    "5": "go",
    "6": "roku",
    "7": "nana",
    "8": "hachi",
    "9": "kyuu",
    "10": "juu",
    "100": "hyaku",
    "1000": "sen",
    "10000": "man",
    "100000000": "oku",
    "300": "sanbyaku",
    "600": "roppyaku",
    "800": "happyaku",
    "3000": "sanzen",
    "8000": "hassen",
    "01000": "issen",
};

const kanjiDict: ConversionDictionary = {
    ".": "点",
    "0": "零",
    "1": "一",
    "2": "二",
    "3": "三",
    "4": "四",
    "5": "五",
    "6": "六",
    "7": "七",
    "8": "八",
    "9": "九",
    "10": "十",
    "100": "百",
    "1000": "千",
    "10000": "万",
    "100000000": "億",
    "300": "三百",
    "600": "六百",
    "800": "八百",
    "3000": "三千",
    "8000": "八千",
    "01000": "一千",
};

const hiraganaDict: ConversionDictionary = {
    ".": "てん",
    "0": "ゼロ",
    "1": "いち",
    "2": "に",
    "3": "さん",
    "4": "よん",
    "5": "ご",
    "6": "ろく",
    "7": "なな",
    "8": "はち",
    "9": "きゅう",
    "10": "じゅう",
    "100": "ひゃく",
    "1000": "せん",
    "10000": "まん",
    "100000000": "おく",
    "300": "さんびゃく",
    "600": "ろっぴゃく",
    "800": "はっぴゃく",
    "3000": "さんぜん",
    "8000": "はっせん",
    "01000": "いっせん",
};

const keyDict = {
    kanji: kanjiDict,
    hiragana: hiraganaDict,
    romaji: romajiDict,
};

function lenOne(convertNum: string, requestedDict: ConversionDictionary): string {
    // Returns single digit conversion, 0-9
    return requestedDict[convertNum];
}

function lenTwo(convertNum: string, requestedDict: ConversionDictionary): string {
    // Returns the conversion, when number is of length two (10-99)
    if (convertNum[0] === "0") { //if 0 is first, return lenOne
      return lenOne(convertNum[1], requestedDict);
    }
    if (convertNum === "10") {
      return requestedDict["10"]; // Exception, if number is 10, simple return 10
    }
    if (convertNum[0] === "1") { // When first number is 1, use ten plus second number
      return requestedDict["10"] + " " + lenOne(convertNum[1], requestedDict);
    } else if (convertNum[1] === "0") { // If ending number is zero, give first number plus 10
      return lenOne(convertNum[0], requestedDict) + " " + requestedDict["10"];
    } else {
      const numList = [];
      for (let x of convertNum) {
        numList.push(requestedDict[x]);
      }
      numList.splice(1, 0, requestedDict["10"]);
      // Convert to a string (from an array)
      let output = "";
      for (let y of numList) {
        output += y + " ";
      }
      output = output.slice(0, -1); // remove the last space
      return output;
    }
}

function lenThree(convertNum: string, requestedDict: ConversionDictionary): string {
    // Returns the conversion, when number is of length three (100-999)
    const numList = [];
    if (convertNum[0] === "1") {
      numList.push(requestedDict["100"]);
    } else if (convertNum[0] === "3") {
      numList.push(requestedDict["300"]);
    } else if (convertNum[0] === "6") {
      numList.push(requestedDict["600"]);
    } else if (convertNum[0] === "8") {
      numList.push(requestedDict["800"]);
    } else {
      numList.push(requestedDict[convertNum[0]]);
      numList.push(requestedDict["100"]);
    }
    if (convertNum.slice(1) === "00" && convertNum.length === 3) {
      // do nothing
    } else {
      if (convertNum[1] === "0") {
        numList.push(requestedDict[convertNum[2]]);
      } else {
        numList.push(lenTwo(convertNum.slice(1), requestedDict));
      }
    }
    let output = "";
    for (let y of numList) {
      output += y + " ";
    }
    output = output.slice(0, -1);
    return output;
}

function lenFour(convertNum: string, requestedDict: ConversionDictionary, standAlone: boolean) {
    // Returns the conversion, when number is of length four (1000-9999)
    const numList = [];
    // First, check for zeros (and get deal with them)
    if (convertNum === "0000") {
      return "";
    }
    while (convertNum[0] === "0") {
      convertNum = convertNum.slice(1);
    }
    if (convertNum.length === 1) {
      return lenOne(convertNum, requestedDict);
    } else if (convertNum.length === 2) {
      return lenTwo(convertNum, requestedDict);
    } else if (convertNum.length === 3) {
      return lenThree(convertNum, requestedDict);
    } else {
      // If no zeros, do the calculation
      // Have to handle 1000, depending on if its a standalone 1000-9999 or included in a larger number
      if (convertNum[0] === "1" && standAlone) {
        numList.push(requestedDict["1000"]);
      } else if (convertNum[0] === "1") {
        numList.push(requestedDict["01000"]);
      } else if (convertNum[0] === "3") {
        numList.push(requestedDict["3000"]);
      } else if (convertNum[0] === "8") {
        numList.push(requestedDict["8000"]);
      } else {
        numList.push(requestedDict[convertNum[0]]);
        numList.push(requestedDict["1000"]);
      }
      if (convertNum.slice(1) === "000" && convertNum.length === 4) {
        // do nothing
      } else {
        if (convertNum[1] === "0") {
          numList.push(lenTwo(convertNum.slice(2), requestedDict));
        } else {
          numList.push(lenThree(convertNum.slice(1), requestedDict));
        }
      }
      let output = "";
      for (let y of numList) {
        output += y + " ";
      }
      output = output.slice(0, -1);
      return output;
    }
}

function lenX(convertNum: string, requestedDict: ConversionDictionary) {
    // Returns everything else.. (up to 9 digits)
    const numList = [];
    if (convertNum.slice(0, -4).length === 1) {
      numList.push(requestedDict[convertNum.slice(0, -4)]);
      numList.push(requestedDict["10000"]);
    } else if (convertNum.slice(0, -4).length === 2) {
      numList.push(lenTwo(convertNum.slice(0, 2), requestedDict));
      numList.push(requestedDict["10000"]);
    } else if (convertNum.slice(0, -4).length === 3) {
      numList.push(lenThree(convertNum.slice(0, 3), requestedDict));
      numList.push(requestedDict["10000"]);
    } else if (convertNum.slice(0, -4).length === 4) {
      numList.push(lenFour(convertNum.slice(0, 4), requestedDict, false));
      numList.push(requestedDict["10000"]);
    } else if (convertNum.slice(0, -4).length === 5) {
      numList.push(requestedDict[convertNum.slice(0, 1)]);
      numList.push(requestedDict["100000000"]);
      numList.push(lenFour(convertNum.slice(1, 5), requestedDict, false));
      if (convertNum.slice(1, 5) === "0000") {
        // pass
      } else {
        numList.push(requestedDict["10000"]);
      }
    } else {
      return "Not yet implemented, please choose a lower number.";
    }
    numList.push(lenFour(convertNum.slice(-4), requestedDict, false));
    let output = "";
    for (let y of numList) {
      output += y + " ";
    }
    output = output.slice(0, output.length - 1);
    return output;
}
  
function removeSpaces(convertResult: string) {
    // Remove spaces in Hirigana and Kanji results
    let correction = "";
    for (let x of convertResult) {
      if (x === " ") {
        // pass
      } else {
        correction += x;
      }
    }
    return correction;
}
  
function doConvert(convertNum: string, requestedDict: ConversionDictionary) {
    // Check lengths and convert accordingly
    if (convertNum.length === 1) {
      return lenOne(convertNum, requestedDict);
    } else if (convertNum.length === 2) {
      return lenTwo(convertNum, requestedDict);
    } else if (convertNum.length === 3) {
      return lenThree(convertNum, requestedDict);
    } else if (convertNum.length === 4) {
      return lenFour(convertNum, requestedDict, true);
    } else {
      return lenX(convertNum, requestedDict);
    }
}

export function convert(convertNumParam: string, dictChoiceUppercase: keyof typeof keyDict): string {
    // Input formatting
    let convertNum = String(convertNumParam);
    convertNum = convertNum.replace(",", "");
    const dictChoice = dictChoiceUppercase.toLowerCase() as keyof typeof keyDict | "all"
  
    // If all is selected as dictChoice, return as a list
    if (dictChoice === "all") {
      const resultList = [];
      for (const x of ["kanji", "hiragana", "romaji"] as (keyof typeof keyDict)[]) {
        resultList.push(convert(convertNum, x));
      }
      // @ts-ignore
      return resultList;
    }
  
    const dictionary = keyDict[dictChoice];
  
    // Exit if length is greater than current limit
    if (convertNum.length > 9) {
      return "Number length too long, choose less than 10 digits";
    }
  
    // Remove any leading zeroes
    while (convertNum[0] === "0" && convertNum.length > 1) {
      convertNum = convertNum.slice(1);
    }
  
    // Check for decimal places
    let result;
    if (convertNum.includes(".")) {
      result = splitPoint(convertNum, dictChoice);
    } else {
      result = doConvert(convertNum, dictionary);
    }
  
    // Remove spaces and return result
    if (keyDict[dictChoice] === romajiDict) {
      // do nothing
    } else {
      result = removeSpaces(result);
    }
    return result;
}

function splitPoint(numToSplit: string, dictChoice: keyof typeof keyDict) {
    // Used if a decimal point is in the string.
    const splitNum = numToSplit.split(".");
    const splitNumA = splitNum[0];
    let splitNumB = splitNum[1];
    let splitNumBEnd = " ";
    for (const x of splitNumB) {
      splitNumBEnd += lenOne(x, keyDict[dictChoice]) + " ";
    }
    // To account for small exception of small tsu when ending in jyuu in hiragana/romaji
    if (
      splitNumA.slice(-1) === "0" &&
      splitNumA.slice(-2, -1) !== "0" &&
      dictChoice === "hiragana"
    ) {
      let smallTsu = convert(splitNumA, dictChoice);
      smallTsu = smallTsu.slice(0, -1) + "っ";
      return smallTsu + keyDict[dictChoice]["."] + splitNumBEnd;
    }
    if (
      splitNumA.slice(-1) === "0" &&
      splitNumA.slice(-2, -1) !== "0" &&
      dictChoice === "romaji"
    ) {
      let smallTsu = convert(splitNumA, dictChoice);
      smallTsu = smallTsu.slice(0, -1) + "t";
      return smallTsu + keyDict[dictChoice]["."] + splitNumBEnd;
    }
    return convert(splitNumA, dictChoice) + " " + keyDict[dictChoice]["."] + splitNumBEnd;
}

function doKanjiConvert(convertNum: string) {
    // Converts kanji to arabic number

    if (convertNum === "零") {
        return 0;
    }

    // First, needs to check for MAN 万 and OKU 億 kanji, as need to handle differently, splitting up the numbers at these intervals.
    // key tells us whether we need to add or multiply the numbers, then we create a list of numbers in an order we need to add/multiply
    let key = [];
    let numberList = [];
    let y: string | number = "";
    for (let x of convertNum) {
        if (x === "万" || x === "億") {
            numberList.push(y);
            key.push("times");
            numberList.push(x);
            key.push("plus");
            y = "";
        } else {
            y += x;
        }
    }
    if (y !== "") {
        numberList.push(y);
    }

    let numberListConverted = [];
    let baseNumber = ["一", "二", "三", "四", "五", "六", "七", "八", "九"];
    let linkNumber = ["十", "百", "千", "万", "億"];

    // Converts the kanji number list to arabic numbers, using the 'base number' and 'link number' list above. For a link number, we would need to
    // link with a base number
    for (let noX of numberList) {
        let count = noX.length;
        let result = 0;
        let skip = 1;
        for (let x of noX.split('').reverse()) {
            let addTo = 0;
            skip--;
            count--;
            if (skip === 1) {
                continue;
            }
            if (baseNumber.includes(x)) {
                for (let [y, z] of Object.entries(kanjiDict)) {
                    if (z === x) {
                        result += parseInt(y);
                    }
                }
            } else if (linkNumber.includes(x)) {
                if (count > 0 && baseNumber.includes(noX[count - 1])) {
                    for (let [y, z] of Object.entries(kanjiDict)) {
                        if (z === noX[count - 1]) {
                            let tempNo = parseInt(y);
                            for (let [y, z] of Object.entries(kanjiDict)) {
                                if (z === x) {
                                    addTo += tempNo * parseInt(y);
                                    result += addTo;
                                    skip = 2;
                                }
                            }
                        }
                    }
                } else {
                    for (let [y, z] of Object.entries(kanjiDict)) {
                        if (z === x) {
                            result += parseInt(y);
                        }
                    }
                }
            }
        }
        // @ts-ignore
        numberListConverted.push(parseInt(result));
    }

    let result = numberListConverted[0];
    y = 0;

    // Iterate over the converted list, and either multiply/add as instructed in key list
    for (let x = 1; x < numberListConverted.length; x++) {
        if (key[y] === "plus") {
            try {
                if (key[y + 1] === "times") {
                    result = result + numberListConverted[x] * numberListConverted[x + 1];
                    y++;
                } else {
                    result += numberListConverted[x];
                }
            } catch (e) {
                result += numberListConverted[numberListConverted.length - 1];
                break;
            }
        } else {
            result *= numberListConverted[x]
        }
    }

    return result
}
