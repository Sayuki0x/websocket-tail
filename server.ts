// Copyright (C) 2019 ExtraHash
//
// Please see the included LICENSE file for more information.
import express from 'express';
import chalk from 'chalk';
import http from 'http';
import WebSocket from 'ws';
import yargs from 'yargs';
import LogTail from './LogTail';

// setting up the express server
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// setting up the command line arguments
const argv = yargs
  .command(
    '--path',
    "Specifies the path to the log file you'd like to tail. (Required)",
    {
      path: {
        description: 'the path to the log file',
        alias: 'p',
        type: 'string'
      }
    }
  )
  .command(
    '--port',
    'Specifies the port to open the websocket server on. (Optional)',
    {
      path: {
        description: 'the port to use for the server',
        type: 'number'
      }
    }
  )
  .help()
  .alias('help', 'h').argv;

// checking that required arguments are present
if (!argv.path) {
  console.log(
    chalk.red.bold(
      "You haven't supplied a path to the log file. A log file location is required."
    )
  );
  console.log(
    chalk.bold('Syntax: ') + '    node index.js --path /path/to/log/file.log'
  );
  console.log();
  console.log('Exiting...');
  process.exit(1);
}

// setting up the logger
const { path, port } = argv;
const logTail = new LogTail(String(path));
const { logEvents } = logTail;

// on connection
wss.on('connection', (ws: WebSocket) => {
  console.log('New websocket connection.');

  // send the history first (last 100 lines)
  const { log } = logTail;

  log.forEach((line: string) => {
    ws.send(line);
  })

  // send the logstream
  logEvents.on('newLine', line => {
    ws.send(line);
  });
});

//start our server
server.listen(Number(port) || 8999, () => {
  console.log(`Server started on port ${port}`);
});
