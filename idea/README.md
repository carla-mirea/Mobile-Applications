# Concerts Management Application

## Short Description

The application is dedicated to concert managers, allowing them to create and manage concerts in an efficient way. Users can add details about each concert, such as performers, location, date, and perform basic operations - create, read, update, delete. The mobile app ensures that the concert data is securely stored both on the device and the server, and it also provides an user-friendly interface.

## Domain details

**Concert**:

- *Name*: The name of the concert
- *Description*: A short overview of the concert
- *Date*: The date when the concert is planned to happen
- *Location*: The place or address where the concert will take place
- *List of Performers*: The performers of the concert
- *Link*: The link to the official page of the concert
- *Status*: Whether the concert is ***Upcoming***, ***Completed***, or ***Canceled***.

## CRUD Operations:

1. **Create**:
    - Users can add new concerts
    - The “Create Concert” form allows users to input all specific details of the entity and add it accordingly
    - Persistence and Offline Device Scenario:
        - When online, the concert and associated data are saved both locally and on the server
        - *Offline Scenario*: the new data is stored locally, and when the device is back online, the data is synced to the server
2. **Read**:
    - Users can view a list of all concerts and related information (e.g. performers)
    - Tapping on a concert will display the detailed view
    - Persistence and Offline Device Scenario:
        - Concert data is fetched from both the local database and the server, ensuring the latest information is displayed when online
        - *Offline Scenario*: When the device is offline, data is retrieved from the local database, such that the users will be able to view the most recently synced concerts. If the data was updated on another device or by another user, the local data might not reflect the latest changes. Once back online, the app checks for updates and refresh the data.
3. **Update**:
    - Users can modify details of a concert (e.g. data, location)
    - Persistence and Offline Device Scenario (same as Create operation):
        - When online, the updates are saved both on local database and the server.
        - *Offline Scenario*: the updated data is stored locally, and when the device is back online, the data is synced to the server
4. **Delete**:
    - Users can remove a concert
    - Persistence and Offline Device Scenario (same as Create operation):
        - The operation is recorded in both the local database and the server, ensuring the permanent removing of the concert
        - *Offline Scenario*: the deletion is marked locally, but it will not reflect on the server until the device reconnects. Once online, the concert is removed from the database.

![image](https://github.com/user-attachments/assets/1c8250b5-c17c-42ed-b90b-e3553bf3149e)

