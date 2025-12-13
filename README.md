# RecipeMaster FRONTEND

## CONFIGURATION AND SETUP

- Clone the container file from the repository which contains .devcontainer
- Open the folder in the vscode as a docker container
- Change directory to frontend with the command "cd frontend"
- Now run "npm install" to install all the necessary files
- create a .env file inside frontend folder and add REACT_APP_CLIENT_ID=&lt;google client id&gt;


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


