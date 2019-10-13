// Copyright (C) 2019 ExtraHash
//
// Please see the included LICENSE file for more information.
import EventEmitter from 'events';
import os from 'os';
import fs from 'fs';
import { Tail } from 'tail';

let logHistory: string[];

type TailOptions = {
  separator: RegExp;
  fromBeginning: boolean;
  fsWatchOptions: any;
  follow: boolean;
  useWatchFile: boolean;
  logger: Console;
};

if (fs.existsSync('logHistory.json')) {
  const rawUserConfig = fs.readFileSync('logHistory.json').toString();

  // check if the history file is valid JSON before parsing it
  try {
    logHistory = JSON.parse(rawUserConfig);
  } catch {
    // if it isn't, throw
    throw new Error("The log history file isn't valid JSON!");
  }
}

export default class LogTail {
  private logLocation: string;
  private tailOptions: TailOptions = {
    separator: /[\r]{0,1}\n/,
    fromBeginning: false,
    fsWatchOptions: {},
    follow: true,
    useWatchFile: os.platform() === 'win32',
    logger: console
  };
  public log: string[] = logHistory;
  private tail: Tail;
  public logEvents = new EventEmitter();

  constructor(logLocation: string) {
    this.logLocation = logLocation;
    this.tail = new Tail(this.logLocation, this.tailOptions);
    this.tail.on('line', line => this.addToLog(line));
    this.tail.on('error', error => this.addToLog(error.toString()));
  }

  public startTail() {
    this.tail.watch();
  }

  public stopTail() {
    this.tail.unwatch();
  }

  private addToLog(line: string) {
    this.log.unshift(line);
    if (this.log.length > 100) {
      this.log.pop();
    }

    fs.writeFile(
      'logHistory.json',
      JSON.stringify(this.log.reverse()),
      () => null
    );

    this.logEvents.emit('newLine', line);
  }
}
