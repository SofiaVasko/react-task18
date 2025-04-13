import "./App.css";
import React from "react";

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autostart: props.autostart,
      time: props.time,
      step: props.step,
      isRunning: props.autostart,
    };

    this.toggleTimer = this.toggleTimer.bind(this);
    this.timerStart = this.timerStart.bind(this);
    this.timerEnd = this.timerEnd.bind(this);
  }
  componentDidMount() {
    if (this.state.autostart) {
      this.timerStart();
    }
  }
  formatTime() {
    let hours = Math.floor(this.state.time / 3600);
    let minutes = Math.floor((this.state.time % 3600) / 60);
    let seconds = this.state.time % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  timerStart() {
    if (this.props.onTimeStart) {
      this.props.onTimeStart(this.state.time);
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      this.setState((prevState) => {
        if (prevState.time > 0) {
          const newTime = prevState.time - 1;
          if (this.props.onTick) {
            this.props.onTick(newTime);
          }
          return { time: newTime };
        } else {
          clearInterval(this.interval);
          if (this.props.onTimeEnd) {
            this.props.onTimeEnd();
          }
          return { time: 0 };
        }
      });
    }, this.state.step);
  }
  timerEnd() {
    if (!this.interval) {
      return;
    } else {
      clearInterval(this.interval);
      if (this.props.onTimePause) {
        this.props.onTimePause(this.state.time);
      }
      this.interval = null;
    }
  }
  toggleTimer() {
    if (this.state.isRunning) {
      this.timerEnd();
    } else {
      this.timerStart();
    }
    this.setState((prevState) => ({ isRunning: !prevState.isRunning }));
  }
  render() {
    return (
      <div className="timer">
        <p className="formatTime">TIME️🕡{this.formatTime()}</p>
        <button onClick={this.toggleTimer} className="start">
          {this.state.isRunning ? "pause" : "start"}
        </button>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Timer
          onTick={(time) => console.log("How much time is left: ", time)}
          onTimeEnd={() => console.log("Time is up.")}
          onTimeStart={(timeLeft) =>
            console.log("Timer was launched.", timeLeft)
          }
          onTimePause={(timeLeft) => console.log("Timer is on hold.", timeLeft)}
          autostart
          time={24 * 3600}
          step={1000}
        />
      </div>
    );
  }
}

export default App;
