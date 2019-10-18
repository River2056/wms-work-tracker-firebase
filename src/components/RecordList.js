import React from "react";

const RecordList = props => {
  return (
    <div>
      {
        props.records.map((_rec, index) =>
          <p
            key={index}
            style={styles.paragraph}
          >
            <span style={styles.monthDate}>{_rec.month}-{_rec.date} </span>
            <span>start: {_rec.startTime} end: {_rec.endTime}</span>
          </p>
        )
      }
    </div>
  );
};

const styles = {
  paragraph: {
    margin: '20px 0',
    fontSize: '1.5rem'
  },
  monthDate: {
    fontWeight: 'bold'
  }
}

export default RecordList;