export const IP = '192.168.1.138:2419';

// IP = '10.0.2.2:2528

const baseUrl = `http://${IP}`

function createAbortSignal() {
    const controller = new AbortController();
    const timeout = 2000;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    return {
        signal: controller.signal, 
        timeoutId: timeoutId
    };
}

export async function getCategoriesFromServer() {
    const {signal, timeoutId} = createAbortSignal();
    console.log('Fetching categories from server.');

    try {
        const response = await fetch(baseUrl + '/categories', {signal: signal});
        
        if (!response.ok)
            throw new Error(`Response status not ok! Status: ${response.status}`);

        clearTimeout(timeoutId);

        const data: string[] = await response.json();
        return data;
    }
    catch (error) {
        console.log(`Error on get categories: ${error}`);
        throw error;
    }
}

export async function getRecordsForCategoryFromServer(category: string) {
    const {signal, timeoutId} = createAbortSignal();
    console.log(`Fetching all items for ${category} from server.`);

    try {
        const response = await fetch(baseUrl + `/items/${category}`, {signal: signal});
        if (!response.ok)
            throw new Error(`Response status not ok! Status: ${response.status}`);

        clearTimeout(timeoutId);

        const data: Item[] = await response.json();
        
        return data;
    }
    catch (error) {
        console.log(`Error on get records: ${error}`);
        throw error;
    }
}

export async function getRecordsFromServer() {
    const {signal, timeoutId} = createAbortSignal();
    console.log(`Fetching all items from server.`);

    try {
        const response = await fetch(baseUrl + `/all`, {signal: signal});
        if (!response.ok)
            throw new Error(`Response status not ok! Status: ${response.status}`);

        clearTimeout(timeoutId);

        const data: Item[] = await response.json();
        
        return data;
    }
    catch (error) {
        console.log(`Error on get records: ${error}`);
        throw error;
    }
}

export async function getRecordDetailsFromServer(recordId: number) {
    const {signal, timeoutId} = createAbortSignal();
    console.log(`Fetching record details from server for: ${recordId}.`);

    try {
        const response = await fetch(baseUrl + `/vehicle/${recordId}`, {signal: signal});
        if (!response.ok)
            throw new Error(`Response status not ok! Status: ${response.status}`);

        clearTimeout(timeoutId);

        const data: Item = await response.json();
        
        return data;
    }
    catch (error) {
        //console.log(`Error on get records: ${error}`);
        throw error;
    }
}

export async function postRecordToServer(record: Item) {
    const {signal, timeoutId} = createAbortSignal();
    console.log(`Posting record: ${record.model} to server.`);

    try {
        const response = await fetch(baseUrl + `/vehicle`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(record),
                signal: signal
            });
        
        if (!response.ok)
            throw new Error(`Response status not ok! Status: ${response.status}`);

        clearTimeout(timeoutId);

        const data: Item = await response.json();
        
        return data;
    }
    catch (error) {
        console.log(`Error on post record: ${error}`);
        throw error;
    }
}

export async function deleteRecordFromServer(recordId: number) {
    const {signal, timeoutId} = createAbortSignal();
    console.log(`Deleting record: ${recordId} from server.`);

    try {
        const response = await fetch(baseUrl + `/vehicle/${recordId}`,
            {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                signal: signal
            });
        
        if (!response.ok)
            throw new Error(`Response status not ok! Status: ${response.status}`);

        clearTimeout(timeoutId);

        const data: Item = await response.json();
        
        return data;
    }
    catch (error) {
        console.log(`Error on delete record: ${error}`);
        throw error;
    }
}

export async function updateRecordOnServer(recordId: number, newPrice: number) {
    const {signal, timeoutId} = createAbortSignal();
    console.log(`Updating record: ${recordId} from server.`);

    try {
        const response = await fetch(baseUrl + `/members`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: recordId,
                    price: newPrice
                }),
                signal: signal
            });
        
        if (!response.ok)
            throw new Error(`Response status not ok! Status: ${response.status}`);

        clearTimeout(timeoutId);

        const data: Item = await response.json();
        
        return data;
    }
    catch (error) {
        console.log(`Error on delete record: ${error}`);
        throw error;
    }
}


export async function getAllItemsFromServer() {
    const {signal, timeoutId} = createAbortSignal();
    console.log(`Fetching all records from server.`);

    try {
        const response = await fetch(baseUrl + `/all`, {signal: signal});
        if (!response.ok)
            throw new Error(`Response status not ok! Status: ${response.status}`);

        clearTimeout(timeoutId);

        const data: Item[] = await response.json();
        
        return data;
    }
    catch (error) {
        console.log(`Error on get records: ${error}`);
        throw error;
    }
}

// Fetch Manufacturers
export const fetchManufacturers = async () => {
    const {signal, timeoutId} = createAbortSignal();
    console.log(`Fetching all manufacturers from server.`);

    try {
      const response = await fetch(baseUrl + `/types`, {signal: signal});
      if (!response.ok)
         throw new Error("Failed to fetch manufacturers");

      clearTimeout(timeoutId);

      const data: string[] = await response.json();
      
      return data;
    } 
    catch (error) {
      console.log(`Error on get records: ${error}`);
      throw error;
    }
  };

  // Fetch Vehicles for type (manufacturer)
  export async function getVehiclesByType(recordType: string) {
    const {signal, timeoutId} = createAbortSignal();
    console.log(`Fetching record details from server for: ${recordType}.`);

    try {
        const response = await fetch(baseUrl + `/vehicles/${recordType}`, {signal: signal});
        if (!response.ok)
            throw new Error(`Response status not ok! Status: ${response.status}`);

        clearTimeout(timeoutId);

        const data: Item[] = await response.json();
        
        return data;
    }
    catch (error) {
        //console.log(`Error on get records: ${error}`);
        throw error;
    }
}


  // Fetch Vehicles for Owner
  export async function getOwnerVehicles(recordOwner: string) {
    const {signal, timeoutId} = createAbortSignal();
    console.log(`Fetching record details from server for: ${recordOwner}.`);

    try {
        const response = await fetch(baseUrl + `/my/${recordOwner}`, {signal: signal});
        if (!response.ok)
            throw new Error(`Response status not ok! Status: ${response.status}`);

        clearTimeout(timeoutId);

        const data: Item[] = await response.json();
        
        return data;
    }
    catch (error) {
        //console.log(`Error on get records: ${error}`);
        throw error;
    }
}

// Update vehicle
export const updateVehicle = async (vehicle: Item) => {
    const {signal, timeoutId} = createAbortSignal();
    console.log(`Updating a vehicle.. id: ${vehicle.id}`);

    try {
        const response = await fetch(baseUrl + `/updatevehicle`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(vehicle),
            signal,
          });
    
        if (!response.ok)
            throw new Error("Failed to request.");

        clearTimeout(timeoutId);

        const data: Item = await response.json();

        return data;
        
    } catch (error) {
        console.log(`Error on updating a vehicle: ${error}`);
        throw error;
    }
};