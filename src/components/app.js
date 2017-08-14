import React, { Component } from 'react';

let columns = 70;
let rows = 50;
let total = columns * rows;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.randomData(),
      generation: 1,
      playing: false
    };
  }
  randomData() {
    return Array.from({length: total}, item => Math.random() < 0.4 ? true : false);
  }
  calculateNeighbors(id) {
    const nN = [1, columns - 1, columns, columns + 1];
    const a = [id - nN[3], id - nN[2], id - nN[1], id - nN[0], id + nN[0], id + nN[1], id + nN[2], id + nN[3]];
    function isWithinRange(cell) {
      if (cell >= 1 && cell <= total) {
        return true;
      } else {
        return false;
      }
    }
    if (id % columns === 0) {
      return [a[0], a[1], a[3], a[5], a[6]].filter(isWithinRange);
    } else if (id % columns === 1) {
      return [a[1], a[2], a[4], a[6], a[7]].filter(isWithinRange);
    } else {
      return a.filter(isWithinRange);
    }
  }
  isAlive(cellID) {
    if (this.state.data[cellID - 1]) {
      return true;
    } else {
      return false;
    }
  }
  liveNeighbors(cellID) {
    return this.calculateNeighbors(cellID).map(item => this.isAlive(item));
  }
  liveOrDie(cellID) {
    let length = this.liveNeighbors(cellID).filter(item => item === true).length;
    if (!this.isAlive(cellID)) {
      if (length === 3) {
        return true;
      } else {
        return false;
      }
    } else {
      if (length >= 2 && length <= 3) {
        return true;
      } else {
        return false;
      }
    }
  }
  timer() {
    let emptyBoard = this.state.data.every(status => !status);
    let newData = this.state.data.map((item, id) => this.liveOrDie(id + 1));
    this.setState({
      data: newData,
      generation: this.state.generation + 1
    });
    if (this.state.generation >= 999 || emptyBoard) {
      clearInterval(this.intervalID);
    }
  }
  componentDidMount() {
    this.onRun();
  }
  onRun() {
    this.intervalID = setInterval(this.timer.bind(this), 300);
    this.setState({
      playing: true
    });
  }
  onPlayPause() {
    if (this.state.playing) {
      clearInterval(this.intervalID);
      this.setState({
        playing: false
      });
    } else {
      this.onRun();
    }
  }
  onClear() {
    clearInterval(this.intervalID);
    this.setState({
      data: Array.from({length: total}, item => false),
      generation: 0,
      playing: false
    });
  }
  toggleStatus(index) {
    let array = [...this.state.data];
    array[index] = !array[index];
    this.setState({
      data: array
    });
  }
  onRandomStart() {
    this.setState({
      data: this.randomData(),
      generation: 1
    });
    this.onRun();
  }
  render() {
    return (
      <div className="row">
        <div className="col-lg-10">
          <div className="board">
            {this.state.data.map((item, index) => (
               <div onClick={() => this.toggleStatus(index)} className={"cell" + (this.state.data[index] ? " alive" : " dead")} id={"c" + (index + 1)} key={index} />
            ))}
          </div>
        </div>
        <div className="col-lg-2">
          <h1>Game of Life</h1>
          <h3>Gen #{('0000'+this.state.generation).slice(-3)}</h3>
          <button onClick={() => this.onPlayPause()} className={"btn" + (this.state.playing ? " btn-default" : " btn-success")} type="button">{this.state.playing ? 'Pause' : 'Play'}</button>
          <button onClick={() => this.onClear()} className="btn btn-danger" type="button">Clear</button>
          <button onClick={() => this.onRandomStart()} className="btn btn-primary">Random Start</button>
        </div>
      </div>
    );
  }
}
