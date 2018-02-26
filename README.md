# Patient Data Dashboard

The software system of "Patient Data Dashboard" is developed for Genentech PRO-SM Dashboard Project. It will help the clinician to improve the patient experience of cancer care. It features drag-and-drop widgets for various Patient-Report-Outcome and Self-Management modules.

#### Prepare your system
To run Patient Data Dashboard, your system should have the following required software:
- [Node.js + npm](https://www.npmjs.com/get-npm) - Note: get the long-term release version.
- After installing Node.js and `npm`, install the demo server (to run the PDD web app). From the command line:  
  `npm install -g http-server`
- Install the mock-up server (to serve simulated data). From the command line:  
    `npm install -g json-server`

#### The PDD software can be downloaded at [Patient Data Dashboard Release Page](https://github.com/kgrid/dashboard/releases)

1. Download the latest version and unzip;
2. Change to the designated folder;
3. On command line,
    For Windows, run `pdd-start.bat`;
    For Mac, run `./pdd-start.sh`;
4. Open your browser and go to `http://localhost:8080`
5. When finished, on command line, run `pdd-stop.bat` for Windows, or run `./pdd-stop.sh` for Mac
6. If you are upgrading the software with latest version, the web application will need a reset to clean the persisted local storage.
After reset, it is recommended to also do a hard reload of the page to clear any cached content.

#### Set up the test stations
At the start page, test station, patient case type, session id will be displayed.

To make changes,
1. Move the mouse to the right upper area to bring out the administrator dropdown;
2. Click on `Setup`, an overlay with input form will show up;
3. Select test station;
4. select cancer type;
5. Enter session id or use the spinner;
6. Check if the session will start with training mode;
7. Once done, click `apply`.

The start page should display the configured values. If all correct, click `Start`. 
