import { LandingPage } from "./pages/landing/landing.page";
import { IsMobileProvider } from "./providers/isMobile.provider";
import { UserProvider } from "./providers/user.provider";

function App() {
  return (
    <UserProvider>
      <IsMobileProvider>
        <LandingPage />
      </IsMobileProvider>
    </UserProvider>
  );
}

export default App;
