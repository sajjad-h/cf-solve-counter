/** utility params and functions */

const MILLISECONDS_IN_A_DAY = 1000 * 3600 * 24;

function dateDiff(date1, date2) {
    var differenceInTime = date2.getTime() - date1.getTime();
    var differenceInDays = differenceInTime / MILLISECONDS_IN_A_DAY;
    return Math.round(differenceInDays);
}

function getPreviousDate(date) {
    return new Date(date - MILLISECONDS_IN_A_DAY);
}

function formatDate(date) {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString("en-EN", options); // Monday, April 18, 2022
}

/** create a div */
let mainDiv = document.createElement('div');
mainDiv.setAttribute("class", "roundbox ");
mainDiv.setAttribute("style", "padding:2em 1em 0 1em;margin-top:1em; height: 339px; width: 848px;");

leftTopDiv = document.createElement("div");
leftTopDiv.setAttribute("class", "roundbox-lt");
leftTopDiv.setAttribute("style", "color: white;");
leftTopDiv.innerText="&nbsp;";

rightTopDiv = document.createElement("div");
rightTopDiv.setAttribute("class", "roundbox-rt");
rightTopDiv.setAttribute("style", "color: white;");
rightTopDiv.innerText="&nbsp;";

leftBottomDiv = document.createElement("div");
leftBottomDiv.setAttribute("class", "roundbox-lb");
leftBottomDiv.setAttribute("style", "color: white;");
leftBottomDiv.innerText="&nbsp;";

rightBottomDiv = document.createElement("div");
rightBottomDiv.setAttribute("class", "roundbox-rb");
rightBottomDiv.setAttribute("style", "color: white;");
rightBottomDiv.innerText="&nbsp;";

chartScriptTag = document.createElement("script");
chartScriptTag.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js");
chartScriptTag.setAttribute("type", "module");

chartDiv = document.createElement('div');
canvas = document.createElement("canvas");
canvas.setAttribute("id", "solveCounterChart");
canvas.setAttribute("style", "display: block; box-sizing: border-box; height: 339px; width: 848px;");
canvas.setAttribute("width", "848");
canvas.setAttribute("height", "339");

chartDiv.appendChild(chartScriptTag);
chartDiv.appendChild(canvas);


{/* <div class="roundbox " style="padding:2em 1em 0 1em;margin-top:1em;" height="10">
    <div class="roundbox-lt">&nbsp;</div>
    <div class="roundbox-rt">&nbsp;</div>
    <div class="roundbox-lb">&nbsp;</div>  
    <div class="roundbox-rb">&nbsp;</div>
    <h4>
        Problem Ratings
    </h4>
    <div>
        <canvas id="problemRatingChart" style="display: block; box-sizing: border-box; height: 339px; width: 848px;" width="848" height="339"></canvas>
    </div>
</div> */}

/** create a heading */
let mainHeading = document.createElement('h4');
mainHeading.innerText = "Solve Count (last 10 days)";

/*** create table */
let table = document.createElement('table');
let thead = document.createElement('thead');
let tbody = document.createElement('tbody');
table.setAttribute("border", "2");

table.appendChild(thead);
table.appendChild(tbody);

mainDiv.appendChild(leftTopDiv);
mainDiv.appendChild(rightTopDiv);
mainDiv.appendChild(leftBottomDiv);
mainDiv.appendChild(rightBottomDiv);
mainDiv.appendChild(mainHeading);
mainDiv.appendChild(table);
mainDiv.appendChild(chartDiv);
document.getElementById('pageContent').appendChild(mainDiv);

/** table header making */
let rowHeader = document.createElement('tr');
let heading_1 = document.createElement('th');
heading_1.innerHTML = "Sl. No.";
let heading_2 = document.createElement('th');
heading_2.innerHTML = "Date";
let heading_3 = document.createElement('th');
heading_3.innerHTML = "Accepted";

rowHeader.appendChild(heading_1);
rowHeader.appendChild(heading_2);
rowHeader.appendChild(heading_3);
thead.appendChild(rowHeader);

const url = window.location.pathname;
const handle = url.substring(url.lastIndexOf('/') + 1);

const currentDate = new Date(Date.now());
currentDate.setHours(0);
currentDate.setMinutes(0);
currentDate.setSeconds(0);

const numberOfDays = 10;
var countArray = Array(numberOfDays);
for (var i = 0; i < numberOfDays; i++) {
    countArray[i] = 0;
}

async function fetchData() {
    const serverURL = "https://codeforces.com/api/user.status?handle=";
    const extraParams = "&from=1&count=1000";
    const apiURL = serverURL + handle + extraParams;
    const res = await fetch (apiURL);
    const record = await res.json();
    if (record.status == "OK") {
        const results = record.result;
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            const verdict = result.verdict;
            var utcSeconds = result.creationTimeSeconds;
            var date = new Date(0); // The 0 there is the key, which sets the date to the epoch
            date.setUTCSeconds(utcSeconds);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);

            var diff = dateDiff(date, currentDate);
            if (diff <= numberOfDays) {
                if (verdict == "OK") countArray[diff]++;
            } else {
                break;
            }
        }

        var date = currentDate;
        for (var i = 0; i < numberOfDays; i++) {
            let row = document.createElement('tr');
            let slNoElement = document.createElement('td');
            slNoElement.innerHTML = i + 1;
            let dateElement = document.createElement('td');
            dateElement.innerHTML = formatDate(date);
            let noOfAcceptedElement = document.createElement('td');
            noOfAcceptedElement.innerHTML = countArray[i];

            row.appendChild(slNoElement);
            row.appendChild(dateElement);
            row.appendChild(noOfAcceptedElement);
            tbody.appendChild(row);

            date = getPreviousDate(date);
        }
    }
}



// var xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
// var yValues = [55, 49, 44, 24, 15];
// var barColors = ["red", "green","blue","orange","brown"];


// import Chart from "vendor/chart";

// new Chart("myChart", {
//   type: "bar",
//   data: {
//     labels: xValues,
//     datasets: [{
//       backgroundColor: barColors,
//       data: yValues
//     }]
//   },
//   options: {
//     legend: {display: false},
//     title: {
//       display: true,
//       text: "World Wine Production 2018"
//     }
//   }
// });
fetchData();