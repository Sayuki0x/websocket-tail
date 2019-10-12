# websocket-tail

A simple websocket server that tails a text file and emits the tail via websocket messags.

## Dependencies

- nodejs v10.x
- yarn package manager

## Installation

Clone the repository:

```shell
git clone https://github.com/ExtraHash/websocket-tail
```

Change into the directory:

```shell
cd websocket-tail
```

Install the javascript dependencies:

```shell
yarn
```

## Usage

```shell
node server.js --path path/to/text/file.log --port 11111
```

The port number is optional, it will default to port 8999 if none is specified.