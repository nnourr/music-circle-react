import queryString from 'query-string';
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from './config/globals';

function App() {
  const state = "hdickalporhfsjcy";
  const scope = "user-top-read user-read-email";

  const startLoginFlow = () => {
    window.open("https://accounts.spotify.com/authorize?" +
    queryString.stringify({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      state: state,
    }),"_blank")
  }
  return (
    <div className="App">
      <button onClick={() => {startLoginFlow()}}>login to spotify</button>
    </div>
  );
}

export default App;
