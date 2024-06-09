import ReactDOM from "react-dom/client";
import "./index.css";
import { HashRouter } from "react-router-dom";
import { IsMobileProvider } from "./providers/isMobile.provider";
import { UserProvider } from "./providers/user.provider";
import { AnimatedRoutes } from "./animatedRoutes";
import { UserCirclesProvider } from "./providers/userCircles.provider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <UserProvider>
    <UserCirclesProvider>
      <IsMobileProvider>
        <HashRouter>
          <AnimatedRoutes />
        </HashRouter>
      </IsMobileProvider>
    </UserCirclesProvider>
  </UserProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
