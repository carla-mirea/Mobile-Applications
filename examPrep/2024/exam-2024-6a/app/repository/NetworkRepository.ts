export const IP = '192.168.1.138:2406';

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
        const response = await fetch(baseUrl + `/medicalsupplies`, {signal: signal});
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
        const response = await fetch(baseUrl + `/medicalsupply/${recordId}`, {signal: signal});
        if (!response.ok)
            throw new Error(`Response status not ok! Status: ${response.status}`);

        clearTimeout(timeoutId);

        const data: Item = await response.json();
        
        return data;
    }
    catch (error) {
        console.log(`Error on get records: ${error}`);
        throw error;
    }
}

export async function postRecordToServer(record: Item) {
    const {signal, timeoutId} = createAbortSignal();
    console.log(`Posting record: ${record.name} to server.`);

    try {
        const response = await fetch(baseUrl + `/medicalsupply`,
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
        const response = await fetch(baseUrl + `/project/${recordId}`,
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
        const response = await fetch(baseUrl + `/allProjects`, {signal: signal});
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

// Fetch supply types
export const getSupplyTypes = async () => {
    const {signal, timeoutId} = createAbortSignal();
    console.log(`Fetching all supplies types from server.`);

    try {
      const response = await fetch(baseUrl + `/suppliestypes`, {signal: signal});
      if (!response.ok)
         throw new Error("Failed to fetch supplies types");

      clearTimeout(timeoutId);

      const data: Item[] = await response.json();
      
      return data;
    } 
    catch (error) {
      console.log(`Error on get records: ${error}`);
      throw error;
    }
  };

  // Request a supply
  export const requestSupply = async (recordType: string) => {
    const {signal, timeoutId} = createAbortSignal();
    console.log(`Requesting a supply with type: ${recordType}`);

    try {
        const response = await fetch(baseUrl + `/requestsupply/${recordType}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            signal: signal
    });
    
    if (!response.ok)
        throw new Error("Failed to request the supply.");

    clearTimeout(timeoutId);

    const data: Item = await response.json();

    return data;
        
    } catch (error) {
        console.log(`Error on requesting the supply: ${error}`);
        throw error;
    }
  };

  // Fetch supply orders
  export async function getSupplyOrders() {
    const {signal, timeoutId} = createAbortSignal();
    console.log(`Fetching all supply orders from server.`);

    try {
        const response = await fetch(baseUrl + `/supplyorders`, {signal: signal});
        if (!response.ok)
            throw new Error(`Response status not ok! Status: ${response.status}`);

        clearTimeout(timeoutId);

        const data: Item[] = await response.json();
        
        return data;
    }
    catch (error) {
        console.log(`Error on getting supply orders: ${error}`);
        throw error;
    }
}