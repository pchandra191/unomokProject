import * as fs from 'fs';

function analyzeLogFile(logFilePath: string, totalTimeInSeconds: number) {
  // Read the log file
  const logs: string = fs.readFileSync(logFilePath, 'utf-8');

  const logLines: string[] = logs.trim().split('\n');
  const endpointCounts: Record<string, number> = {};
  const httpStatusCounts: Record<number, number> = {};

  logLines.forEach((line: string) => {
        const httpStatusMatch: RegExpMatchArray | null = line.match(/"(\w+) \/.*" (\d+)/);
    if (httpStatusMatch) {
      const httpStatusCode: number = parseInt(httpStatusMatch[2], 10);
      if (httpStatusCounts[httpStatusCode]) {
        httpStatusCounts[httpStatusCode]++;
      } else {
        httpStatusCounts[httpStatusCode] = 1;
      }
    }
    

    const match: RegExpMatchArray | null = line.match(/a request has been made with the following uuid \[.*\] (.+) webapp/);
    if (match) {
      const endpoint: string = match[1];
      if (endpointCounts[endpoint]) {
        endpointCounts[endpoint]++;
      } else {
        endpointCounts[endpoint] = 1;
      }
    }
  });

    console.log(`Log File Name Counting: ${logFilePath}`);
    console.log('HTTP Status Code Counts:');
  console.table(
    Object.entries(httpStatusCounts).map(([statusCode, count]) => ({
      'Status Code': statusCode,
      'Count': count,
    }))
  );

  // Calculate the total sum of endpoint counts
  const totalEndpointCounts = Object.values(endpointCounts).reduce((sum, count) => sum + count, 0);

  // Convert the total time duration to minutes
  const totalTimeInMinutes = totalTimeInSeconds / 60;

  // Calculate API calls per minute
  const apiCallsPerMinute = totalEndpointCounts / totalTimeInMinutes;

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
const logFilePaths = ['./prod-api-prod-out.log', './api-prod-out.log', './api-dev-out.log'];
const totalTimeInSeconds = 600; // For example, 10 minutes

logFilePaths.forEach((logFilePath) => {
  analyzeLogFile(logFilePath, totalTimeInSeconds);
});
