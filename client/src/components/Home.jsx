import { Link } from "react-router-dom";

const Home = () => (
  <div style={styles.container}>
    <header style={styles.header}>
      <h1>Welcome to MyApp</h1>
      <p>Explore the features of this app by navigating through the links below.</p>
    </header>
    
    <section style={styles.links}>
      <Link to="/login" style={styles.link}>Login</Link>
      <Link to="/signup" style={styles.link}>Sign Up</Link>
    </section>
    
    <section style={styles.intro}>
      <h2>About MyApp</h2>
      <p>
        MyApp is a platform designed to help users manage their profiles and
        settings securely. Sign in to explore your personalized dashboard and
        update your preferences as needed.
      </p>
    </section>
  </div>
);

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  header: {
    marginBottom: "20px",
  },
  links: {
    marginBottom: "20px",
  },
  link: {
    margin: "0 10px",
    padding: "10px 20px",
    textDecoration: "none",
    color: "#007bff",
    border: "1px solid #007bff",
    borderRadius: "5px",
  },
  intro: {
    marginTop: "20px",
    textAlign: "left",
  },
};

export default Home;
