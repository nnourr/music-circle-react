import queryString from 'query-string';
import { SERVER_ENDPOINT, SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from '../../config/globals';
import { useState } from 'react';
import ArtistsTable from '../../components/artistsTable.component';

function HomePage() {
  const [formEmail, setFormEmail] = useState("")
  const [initialTeam, setInitialTeam] = useState("")
  const [userEmail, setUserEmail] = useState(window.sessionStorage.getItem("userEmail"))
  const scope = "user-top-read user-read-email";
  console.log(userEmail);

  const startLoginFlow = () => {
    window.location.href = "https://accounts.spotify.com/authorize?" +
    queryString.stringify({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      state: "hdickalporhfsjcy",
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

  const handleEmail = (field: string) => {
    setFormEmail(field)
  }

  const handleInitialTeam = (field: string) => {
    setInitialTeam(field)
  }

  const handleSubmit = async () => {
    let teamId = ''
    const newTeamResponse = await fetch(SERVER_ENDPOINT+'/team/' +  initialTeam, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      }
    })
    if (newTeamResponse.status === 200) {
      teamId = await newTeamResponse.json();
    }

    const userResponse = await fetch(SERVER_ENDPOINT+'/user/' + formEmail, {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      },
      body: JSON.stringify({"loginCode": loginCode, "team": teamId})
    })
    if (userResponse.status === 200) {
      window.sessionStorage.setItem("userEmail", formEmail)
      setUserEmail(window.sessionStorage.getItem("userEmail"))      
    }
  }

  return (
    <div className="h-full flex flex-col justify-center items-center">
      {(userEmail === null) 
      ?
        (loginCode === null) 
          ? 
          <>
            <button onClick={() => {startLoginFlow()}}>login to spotify</button>
          </>
          : 
          <div className='h-full flex  justify-center items-center'>
          <label>
            email:
            <input type="text" onChange={(change) => {handleEmail(change.target.value)}}/>
          </label>
            <label>
              new team name:
              <input type="text" onChange={(change) => {handleInitialTeam(change.target.value)}}/>
            </label>
            <button type="submit" onClick={() => handleSubmit()}>submit</button>
          </div>
        : 
        <ArtistsTable/>
      }
      <button onClick={() => window.sessionStorage.clear()}>clear session</button>
    </div>
  );
}

export default HomePage;
