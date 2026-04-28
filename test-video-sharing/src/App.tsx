import { useAuth } from "react-oidc-context";
import {Button, Text} from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import Information from "./information-page.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    if(!auth.isAuthenticated) {
      alert("You are not signed in")
      return
    }
    const clientId = "6obe163q3ctpedbma605auug0a";
    const logoutUri = "<logout uri>";
    const cognitoDomain = "https://us-east-2wpebzobdc.auth.us-east-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Information />

              <div style={{ marginTop: "1rem" }}>
                <pre>Hello: {auth.user?.profile.email}</pre>
                <button onClick={() => auth.removeUser()}>
                  Sign out
                </button>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
  }

  return (
      <div>
        <Information signinButton={<Button
            onClick={() => auth.signinRedirect()}
            backgroundColor="black"
            isFullWidth={true}
          >
          {<Text color="white">Sign in to get started</Text>}
          </Button>}
        />
        <Button variation="primary" onClick={() => signOutRedirect()}>Sign out</Button>

      </div>
  );
}

export default App;