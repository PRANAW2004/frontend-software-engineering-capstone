# RecipeMaster FRONTEND

## CONFIGURATION AND SETUP

- Clone the container file from the repository which contains .devcontainer
- Open the folder in the vscode as a docker container
- Change directory to frontend with the command "cd frontend"
- Now run "npm install" to install all the necessary files
- create a .env file inside frontend folder and add ```REACT_APP_CLIENT_ID=<google client id>```



## ARCHITECTURE EXPLANATION

### The project follows a 3-Tier Architecture, which separates the system into three distinct layers: Presentation Layer, Application (Business Logic) Layer, and Data Layer.

### Presentation Layer:

- This layer handles the user interface (UI), built using React.
- It is responsible for displaying the data to the user and collecting user inputs.
- All user requests, like adding, updating, or viewing recipes, originate from this layer.

### Application Layer:

- Implemented using Express.js, this layer processes requests from the Presentation Layer.
- It contains the core logic of the application, like validating inputs, handling CRUD operations, and communicating with external APIs.
- Acts as a bridge between the UI and the data storage.

### Data Layer:

- Consists of MongoDB and Google Cloud services for storing and retrieving data.
- Handles all data storage, retrieval, and updates requested by the Application Layer.
- Ensures data consistency, persistence, and efficient access.

### Flow of Requests:
- User interacts with the Presentation Layer → sends request to Application Layer → Application Layer queries the Data Layer → Data Layer returns response → Application  Layer processes and sends it back to Presentation Layer.
- This architecture ensures modularity, scalability, and maintainability, as each layer is loosely coupled and can be developed or updated independently.



## DEPLOYMENT STEPS

- The website is deployed to Google Cloud.
- Inside the .devcontainer folder and inside the devcontainer.json file add ```"ghcr.io/dhoeric/features/google-cloud-cli:1": {"version": "latest"}``` inside the features.
- Rebuild the container
- In the terminal, verify the google cloud installation by ```gcloud --version```
- Authenticate the google cloud with '''gcloud auth login''' command
- After authentication, setup the project with ```gcloud config set project <project-id>```
- Create the build file in react with the command ```npm run build```
- Create *app.yaml* file and paste the below commands into the file for the website to host.
```
runtime: nodejs20

env_variables:
  REACT_APP_CLIENT_ID: 138466072982-adt7rp94n1i0vam4k89dniaa4pk0s3d2.apps.googleusercontent.com

handlers:
  # Serve static assets (JS, CSS, images, etc.)
  - url: /(.*\.(js|css|png|jpg|jpeg|gif|svg|ico|json|map))
    static_files: build/\1
    upload: build/(.*\.(js|css|png|jpg|jpeg|gif|svg|ico|json|map))

  # React Router fallback
  - url: /.*
    static_files: build/index.html
    upload: build/index.html
```
- Now execute ```gcloud app deploy``` to host the website
- After deploy execute ```gcloud app browse``` to see the URL


## SEQUENCE DIAGRAM



