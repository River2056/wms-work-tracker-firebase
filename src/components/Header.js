import React from "react";

const Header = () => (
  <div>
    <header>
      <h1 style={styles.title}>Work-Tracker</h1>
    </header>
  </div>
);

const styles = {
  title: {
    textAlign: 'center',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    padding: '10px'
  }
}

export default Header;