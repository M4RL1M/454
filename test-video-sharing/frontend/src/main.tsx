import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from "react-oidc-context";
import App from './App.tsx'
import '@aws-amplify/ui-react/styles.css'

const cognitoAuthConfig = {
    authority: "https://cognito-idp.us-east-2.amazonaws.com/us-east-2_WpEBzObDc",
    client_id: "6obe163q3ctpedbma605auug0a",
    redirect_uri: "http://localhost:5173/auth/callback",
    response_type: "code",
    scope: "email openid phone",
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <AuthProvider {...cognitoAuthConfig}>
            <App />
        </AuthProvider>
    </React.StrictMode>
);