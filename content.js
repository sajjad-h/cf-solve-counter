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

mainDiv.appendChild(mainHeading);
mainDiv.appendChild(table);
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

fetchData();