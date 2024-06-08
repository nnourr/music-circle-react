import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  HashRouter,
  Route,
  RouterProvider,
  createBrowserRouter,
  createHashRouter,
} from "react-router-dom";
import { IsMobileProvider } from "./providers/isMobile.provider";
import { UserProvider } from "./providers/user.provider";
import { LandingPage } from "./pages/landing/landing.page";
import { AnotherLoginState } from "./pages/landing/states/anotherLoginState";
import { NotFoundPage } from "./pages/notfound/notfound.page";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createHashRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/home",
    element: <AnotherLoginState />,
  },
]);

root.render(
  <UserProvider>
    <IsMobileProvider>
      <RouterProvider router={router} />
    </IsMobileProvider>
  </UserProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
