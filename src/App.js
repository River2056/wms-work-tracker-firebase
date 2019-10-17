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
      currentTime: `${year}${month}`
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
      console.log(docData);
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
      console.log(docData);
      this.setState(() => ({ endTime: docData }));
    });
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
          >Clear Records</a>
        </div>

        <RecordList records={record} />
      </div>
    );
  }
}

export default App;
