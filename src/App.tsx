import { LandingPage } from "./pages/landing/landing.page";
import { UserProvider } from "./providers/user.provider";

function App() {
  return (
    <UserProvider>
      <LandingPage />
    </UserProvider>
  );
}

export default App;
