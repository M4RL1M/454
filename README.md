In order to test the gvm API, you'll need to open 2 terminals: One inside the backend folder and another in the frontend folder.

# Backend
To run the code backend, you must first set up the environment in the backend folder. In the backend folder, run the following commands in the terminal:
1) python3 -m venv env
2) source env/bin/activate
3) pip install -r requirements.txt

This will install all the necessary packages to run the backend app program.

After this is done, you will have an environment that can execute the GVM backend app. Each time you boot up the terminal, you will have to run the following to run the backend:
1) source env/bin/activate
2) python app.py

# Frontend
To run the code frontend, npm has to be installed in the frontend folder. If it is installed, simply run "npm run dev" then access the link. By this point, the backend and frontend should be working. Simply navigate to the scan page and enter a domain name or IP you want gvm to scan. The results of the scan should be shown once the scan finishes.
