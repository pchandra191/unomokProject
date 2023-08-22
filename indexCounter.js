"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function analyzeLogFile(logFilePath, totalTimeInSeconds) {
    // Read the log file
    var logs = fs.readFileSync(logFilePath, 'utf-8');
    var logLines = logs.trim().split('\n');
    var endpointCounts = {};
    var httpStatusCounts = {};
    logLines.forEach(function (line) {
        var httpStatusMatch = line.match(/"(\w+) \/.*" (\d+)/);
        if (httpStatusMatch) {
            var httpStatusCode = parseInt(httpStatusMatch[2], 10);
            if (httpStatusCounts[httpStatusCode]) {
                httpStatusCounts[httpStatusCode]++;
            }
            else {
                httpStatusCounts[httpStatusCode] = 1;
            }
        }
        var match = line.match(/a request has been made with the following uuid \[.*\] (.+) webapp/);
        if (match) {
            var endpoint = match[1];
            if (endpointCounts[endpoint]) {
                endpointCounts[endpoint]++;
            }
            else {
                endpointCounts[endpoint] = 1;
            }
        }
    });
    console.log("Log File Name Counting: ".concat(logFilePath));
    console.log('HTTP Status Code Counts:');
    console.table(Object.entries(httpStatusCounts).map(function (_a) {
        var statusCode = _a[0], count = _a[1];
        return ({
            'Status Code': statusCode,
            'Count': count,
        });
    }));
    // Calculate the total sum of endpoint counts
    var totalEndpointCounts = Object.values(endpointCounts).reduce(function (sum, count) { return sum + count; }, 0);
    // Convert the total time duration to minutes
    var totalTimeInMinutes = totalTimeInSeconds / 60;
    // Calculate API calls per minute
    var apiCallsPerMinute = totalEndpointCounts / totalTimeInMinutes;
    // Display Endpoint Counts
    //   console.log(`Endpoint Counts for ${logFilePath}:`);
    //   console.table(
    //     Object.entries(endpointCounts).map(([endpoint, count]) => ({
    //       'Endpoint': endpoint,
    //       'Count': count,
    //     }))
    //   );
    // Display additional summary information
    console.table([
        {
            'Index': 'End Point',
            'Count': totalEndpointCounts,
        },
        {
            'Index': 'Total Time(/minute)',
            'Count': totalTimeInMinutes,
        },
    ]);
}
// Analyze each log file separately
var logFilePaths = ['./prod-api-prod-out.log', './api-prod-out.log', './api-dev-out.log'];
var totalTimeInSeconds = 600; // For example, 10 minutes
logFilePaths.forEach(function (logFilePath) {
    analyzeLogFile(logFilePath, totalTimeInSeconds);
});
