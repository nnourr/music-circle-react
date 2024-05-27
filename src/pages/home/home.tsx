import queryString from 'query-string';
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from '../../config/globals';

function HomePage() {
  const state = "hdickalporhfsjcy";
  const scope = "user-top-read user-read-email";
  console.log(window.location.href);

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
  return (
    <div className="flex">
      <button onClick={() => {startLoginFlow()}}>login to spotify</button>
    </div>
  );
}

export default HomePage;
