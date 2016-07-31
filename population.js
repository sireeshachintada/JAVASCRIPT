var fs = require('fs'), readline = require('readline'), stream = require('stream');

// list of all Asian Countries
var Asian_list = ["Afghanistan", "Bahrain", "Bangladesh", "Bhutan", "Myanmar", "Cambodia", "China", "India", "Indonesia", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan", "Lebanon", "Malaysia", "Maldives", "Mongolia", "Nepal",
"Oman", "Pakistan", "Philippines", "Qatar", "Saudi Arabia", "Singapore", "Sri Lanka", "Syrian Arab Republic", "Tajikistan", "Thailand", "Timor-Leste", "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Vietnam", "Yemen"];

// create read and write streams
var readMe = fs.ReadStream('Indicators.csv'); // input file
var India_Records = fs.WriteStream('lineChart.json'); // this json consists of Urban and rural population of India [1960- 2015]
var Asia_records = fs.WriteStream('barChart.json'); // this json consists of Urban + rural population of Asian Countries [1960- 2015]

var headers = []; // extract the first row
var count = 0, flag = 0; // considered to increment when ever there is a new record found
var countryIndex, indicatorIndex;

var line_by_line = readline.createInterface({
input: readMe,
terminal: false  // needs this for new versions of Node JS
});

// parse csv line by line
line_by_line.on('line', function(line) {
if(count==0) {
  headers=line.split(","); // for the first index elements

  countryIndex = headers.indexOf("CountryName");
  indicatorIndex = headers.indexOf("IndicatorCode");
  Year = headers.indexOf("Year");
  Value = headers.indexOf("Value");
  India_Records.write("[ \n");
  Asia_records.write("[ \n");
  count++;
  flag++;
}
else { // traverse through rest of the file
  var currentline = line.split(",");
  // Gather the data records for India
  if(currentline[countryIndex]==="India" && (currentline[indicatorIndex]==="SP.RUR.TOTL.ZS" || currentline[indicatorIndex]==="SP.URB.TOTL.IN.ZS")) {
    count = writeToFile(currentline,India_Records,count); //write all records for india
  }
  // Gather the data records for Asian countries
  else if(currentline[indicatorIndex]==="SP.RUR.TOTL" || currentline[indicatorIndex]==="SP.URB.TOTL") {
    var condition = false;
    for(var i=0;i<Asian_list.length;i++) {
      if(currentline[countryIndex]===Asian_list[i]) {
        condition = true; // returns true if country is an asian country
        break;
      }
    }
    if(condition) {
      flag = writeToFile(currentline,Asia_records,flag); // write if true
    }
  }
}

}).on('close', () => {
  console.log("write done, check your json files")
  India_Records.write("]");
  Asia_records.write("]");
});

// function to collect and write data
function writeToFile(currentline,writeLine,count) {
var obj = {};
obj[headers[Year]] = currentline[Year];
	if(currentline[indicatorIndex]==="SP.URB.TOTL"){
		obj[headers[Value]] = currentline[Value];
	}
	if(currentline[indicatorIndex]==="SP.RUR.TOTL"){
		obj[headers[Value]] = currentline[Value];
	}
	if(currentline[indicatorIndex]==="SP.RUR.TOTL.ZS"){
		obj[headers[Value]] = currentline[Value];
	}
	if(currentline[indicatorIndex]==="SP.URB.TOTL.IN.ZS"){
		obj[headers[Value]] = currentline[Value];
	}
if(count==1) {
writeLine.write(JSON.stringify(obj)); // convert headers into JSON
}
else {
  writeLine.write(", \n \n"+JSON.stringify(obj)); // convert data into JSON seperated by comma
}

count++; //increment count and return it
return count;
}
