import queryString from 'query-string';
import { SERVER_ENDPOINT, SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from '../../config/globals';
import { useState } from 'react';

function HomePage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const state = "hdickalporhfsjcy";
  const scope = "user-top-read user-read-email";

  const startLoginFlow = () => {
    window.location.href = "https://accounts.spotify.com/authorize?" +
    queryString.stringify({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      state: state,
    })
  }
  const url = new URL(window.location.href);

  const params = new URLSearchParams(url.search);

  const loginCode = params.get('code');
  const error = params.get('error')
  
  if (error !== null) {
    console.log(error);
    return <div>login error</div>
  }

  function handleUsername(field: string) {
    setUsername(field)
  }

  function handleEmail(field: string) {
    setEmail(field)
  }

  const handleSubmit = async () => {
    console.log(username);
    
    await fetch(SERVER_ENDPOINT+'/user/' + email, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({"loginCode": loginCode, "username": username})
    })
  }

  return (
    <div className="h-full flex flex-col justify-center items-center">
    {(loginCode === null) 
      ?
        <button onClick={() => {startLoginFlow()}}>login to spotify</button>
      : 
      <div className='h-full flex  justify-center items-center'>
        <label>
          username:
          <input type="text" onChange={(change) => {handleUsername(change.target.value)}}/>
        </label>
        <label>
          email:
          <input type="text" onChange={(change) => {handleEmail(change.target.value)}}/>
        </label>
        <button type="submit" onClick={() => handleSubmit()}>submit</button>
      </div>
    }
    </div>
  );
}

export default HomePage;
