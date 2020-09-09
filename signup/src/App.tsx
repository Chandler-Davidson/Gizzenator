import React, { useState, FormEvent } from 'react';
import './App.css';

// @ts-ignore
import PhoneInput from 'react-phone-number-input/input';

async function createSubscription(phoneNumber: string) {
  return (await fetch('/subscription', {
    body: JSON.stringify({ phoneNumber }),
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    }
  })).json()
}

function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();

    const message = (await createSubscription(phoneNumber)).message;

    setError(message);
    setSubmitted(true);
  }

  return (
    <div className="App">
      <p>
        Welcome to the <strong>GIZZENATOR</strong>
      </p>

      {isSubmitted && !error ? <p>Thanks for hangin' out!</p> :
        <form onSubmit={submitForm}>
          <PhoneInput
            country="US"
            value={phoneNumber}
            onChange={setPhoneNumber}
            placeholder="1 (555) 555-5555" />
          <input type="submit" value="Gizz me up" />
        </form>
      }

      {
        error ? <p>{error}</p> : <></>
      }
      
      <a
        className="App-link"
        style={{ margin: "10%", textDecorationLine: "underline"}}
        onClick={() => setShowHelp(!showHelp)}
      >What?</a>

      {
        showHelp ? <p>I built a weird thing. I like this band 
          <a
            className="App-link"
            href="https://youtu.be/wxwu7FYFSek"
            target="_blank"
            rel="noopener noreferrer">King Gizzard and The Lizard Wizard</a>,
            they've got some great outlandish lyrics. Sign up here and you'll get daily texts with random lyrics from their songs.</p> : <></>
      }
    </div>
  );
}

export default App;
