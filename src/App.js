import React from 'react';
import './App.css';

import Header from "./components/Header";
import RecordList from "./components/RecordList";
import { CSVLink } from "react-csv";
const firebase = require('firebase');


class App extends React.Component {
  constructor(props) {
    super(props);
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1 < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1;
    this.state = {
      startTime: [],
      endTime: [],
      currentTime: `${year}${month}`,
      test: ''
    }
  }

  componentDidMount = () => {
    // startTime
    firebase.firestore().collection('start_time').get().then(res => {
      const docData = res.docs.map(_doc => {
        const id = _doc.id;
        const data = _doc.data();
        return {
          id,
          month: data.month,
          date: data.date,
          time: data.time
        }
      });
      this.setState(() => ({ startTime: docData }));
    });

    // endTime
    firebase.firestore().collection('end_time').get().then(res => {
      const docData = res.docs.map(_doc => {
        const id = _doc.id;
        const data = _doc.data();
        return {
          id,
          month: data.month,
          date: data.date,
          time: data.time
        }
      });
      this.setState(() => ({ endTime: docData }));
    });
  }

  convertTimeString = time => {
    if (time < 10) {
      return "0" + time.toString();
    }
    return time.toString();
  };

  getNewRecord = () => {
    const currentDate = new Date()
    const month = this.convertTimeString(currentDate.getMonth() + 1);
    const date = this.convertTimeString(currentDate.getDate());
    const hour = this.convertTimeString(currentDate.getHours());
    const min = this.convertTimeString(currentDate.getMinutes());
    const sec = this.convertTimeString(currentDate.getSeconds());
    const timeString = `${hour}:${min}:${sec}`;
    return {
      month,
      date,
      time: timeString
    }
  }

  onStart = () => {
    const newRec = this.getNewRecord();
    const docData = firebase.firestore()
      .collection('start_time')
      .where('month', '==', newRec.month)
      .where('date', '==', newRec.date)
      .get()
      .then(res => {
        // docs found, update
        if (res.docs.length > 0) {
          res.docs.map(_doc => {
            const id = _doc.id;
            const content = _doc.data();
            console.log('update start...', { id, newRec });
            firebase.firestore().collection('start_time').doc(id).update({
              month: newRec.month,
              date: newRec.date,
              time: newRec.time
            });
          });
        } else {
          // no docs found, add
          console.log('no record found, add');
          firebase.firestore().collection('start_time').add(newRec);
        }
      });
  }

  onLeave = () => {
    const newRec = this.getNewRecord();
    const docData = firebase.firestore()
      .collection('end_time')
      .where('month', '==', newRec.month)
      .where('date', '==', newRec.date)
      .get()
      .then(res => {
        // docs found, update
        if (res.docs.length > 0) {
          res.docs.map(_doc => {
            const id = _doc.id;
            const content = _doc.data();
            console.log('update start...', { id, newRec });
            firebase.firestore().collection('end_time').doc(id).update({
              month: newRec.month,
              date: newRec.date,
              time: newRec.time
            });
          });
        } else {
          // no docs found, add
          console.log('no record found, add');
          firebase.firestore().collection('end_time').add(newRec);
        }
      });
  }

  clearAllRecords = async () => {
    if (window.confirm(`Are you sure you want to clear all records?`)) {
      // clear state
      await this.setState(() => ({ startTime: [], endTime: [] }));
      // clear DB
      await firebase.firestore().collection('start_time').get().then(res => {
        res.docs.forEach(_doc => {
          firebase.firestore().collection('start_time').doc(_doc.id).delete();
        });
      });
      await firebase.firestore().collection('end_time').get().then(res => {
        res.docs.forEach(_doc => {
          firebase.firestore().collection('end_time').doc(_doc.id).delete();
        });
      });
    }
  }

  render() {
    // records
    const record = this.state.startTime.map(_rec => {
      return {
        month: _rec.month,
        date: _rec.date,
        startTime: _rec.time,
        endTime: ''
      }
    });
    this.state.endTime.map(_rec => {
      record.map(_recd => {
        if (_recd.month === _rec.month && _recd.date === _rec.date) {
          _recd.endTime = _rec.time
        }
      });
    });
    record.sort((a, b) => {
      return a.month >= b.month && a.date > b.date ? -1 : 1;
    });

    console.log(record);

    const styles = {
      button: {
        padding: '10px 10px',
        backgroundColor: '#007ACC',
        border: 'none',
        textDecoration: 'none',
        fontSize: '16px',
        cursor: 'pointer',
        margin: '0 10px 0 10px',
        color: '#fff',
        borderRadius: '5px',
        borderBottom: '5px solid #005ACC'
      }
    }

    return (
      <div>
        <Header />

        <div>
          <a
            href="javascript:;"
            style={styles.button}
            onClick={this.onStart}
          >Work</a>

          <a
            href="javascript:;"
            style={styles.button}
            onClick={this.onLeave}
          >Leave</a>

          <CSVLink
            data={record}
            separator={` `}
            enclosingCharacter={` `}
            filename={`${this.state.currentTime}.csv`}
            target="_blank"
            style={styles.button}
          >Export CSV</CSVLink>

          <a
            href="javascript:;"
            style={styles.button}
            onClick={this.clearAllRecords}
          >Clear Records</a>
        </div>

        <RecordList records={record} />
      </div>
    );
  }
}

export default App;
