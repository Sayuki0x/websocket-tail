// Copyright (C) 2019 ExtraHash
//
// Please see the included LICENSE file for more information.
import EventEmitter from 'events';
import { Tail } from 'tail';

export default class LogTail {
  private logLocation: string;
  private tail: Tail;
  public logEvents: EventEmitter;

  constructor(logLocation: string) {
    this.logLocation = logLocation;
    this.tail = new Tail(this.logLocation);
    this.tail.on('line', line => this.addToLog(line));
    this.tail.on('error', error => this.addToLog(error.toString()));
    this.logEvents = new EventEmitter();
  }

  startTail() {
    this.tail.watch();
  }

  stopTail() {
    this.tail.unwatch();
  }

  private addToLog(line: string) {
    this.logEvents.emit('newLine', line);
  }
}
