import { useAuth } from "react-oidc-context";
import {Button, Text} from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import Information from "./pages/InformationPage.tsx";

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
        <div>
          <pre> Hello: {auth.user?.profile.email} </pre>
          <pre> ID Token: {auth.user?.id_token} </pre>
          <pre> Access Token: {auth.user?.access_token} </pre>
          <pre> Refresh Token: {auth.user?.refresh_token} </pre>

          <button onClick={() => auth.removeUser()}>Sign out</button>
        </div>
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