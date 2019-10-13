// Copyright (C) 2019 ExtraHash
//
// Please see the included LICENSE file for more information.
import EventEmitter from 'events';
import os from 'os';
import { Tail } from 'tail';

type TailOptions = {
  separator: RegExp;
  fromBeginning: boolean;
  fsWatchOptions: any;
  follow: boolean;
  useWatchFile: boolean;
  logger: Console;
};

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
  private tail: Tail;
  public log: string[];
  public logEvents: EventEmitter;

  constructor(logLocation: string) {
    this.logLocation = logLocation;
    this.tail = new Tail(this.logLocation, this.tailOptions);
    this.tail.on('line', line => this.addToLog(line));
    this.tail.on('error', error => this.addToLog(error.toString()));
    this.logEvents = new EventEmitter();
    this.log = [];
  }

  public startTail() {
    this.tail.watch();
  }

  public stopTail() {
    this.tail.unwatch();
  }

  private addToLog(line: string) {
    this.log.push(line);
    if (this.log.length > 100) {
      this.log.pop();
    }

    this.logEvents.emit('newLine', line);
  }
}
