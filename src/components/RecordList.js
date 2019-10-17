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
            {_rec.month}-{_rec.date} {_rec.startTime} {_rec.endTime}
          </p>
        )
      }
    </div>
  );
};

const styles = {
  paragraph: {
    margin: '20px 0',
    fontSize: '20px'
  }
}

export default RecordList;