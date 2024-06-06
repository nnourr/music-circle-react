import { LandingPage } from "./pages/landing/landing.page";
import { EmailProvider } from "./providers/email.provider";

function App() {
  return ( 
    <EmailProvider>
      <LandingPage/>
    </EmailProvider>
  );
}

export default App;
