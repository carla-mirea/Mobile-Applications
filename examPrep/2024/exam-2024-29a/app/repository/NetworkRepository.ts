export const IP = '172.30.247.10:2429';

//export const IP = '10.0.2.2:2429';

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
        const response = await fetch(baseUrl + `/books`, {signal: signal});
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
        const response = await fetch(baseUrl + `/project/${recordId}`, {signal: signal});
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
    console.log(`Posting record: ${record.title} to server.`);

    try {
        const response = await fetch(baseUrl + `/book`,
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

// Fetch reserved books
export async function fetchReservedBooks() {
    const {signal, timeoutId} = createAbortSignal();
    console.log(`Fetching all reserved books from server.`);

    try {
      const response = await fetch(baseUrl + `/reserved`, {signal: signal});
      if (!response.ok)
         throw new Error("Failed to fetch reserved books");

      clearTimeout(timeoutId);

      const data: Item[] = await response.json();
      
      return data;
    } 
    catch (error) {
      console.log(`Error on get records: ${error}`);
      throw error;
    }
}

  // Reserve a book
  export const reserveBook = async (recordId: number) => {
    const {signal, timeoutId} = createAbortSignal();
    console.log(`Reserving book with id: ${recordId}`);

    try {
        const response = await fetch(baseUrl + `/reserve/${recordId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            signal: signal
    });
    
    if (!response.ok)
        throw new Error("Failed to reserve a book.");

    clearTimeout(timeoutId);

    const data: Item = await response.json();

    return data;
        
    } catch (error) {
        console.log(`Error on reserving a book: ${error}`);
        throw error;
    }
  };

  // Borrow a book
  export const borrowBook = async (recordId: number) => {
    const {signal, timeoutId} = createAbortSignal();
    console.log(`Borrowing a book with id: ${recordId}`);

    try {
        const response = await fetch(baseUrl + `/borrow/${recordId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            signal: signal
    });
    
    if (!response.ok)
        throw new Error("Failed to borrow a book.");

    clearTimeout(timeoutId);

    const data: Item = await response.json();

    return data;
        
    } catch (error) {
        console.log(`Error on borrowing a book: ${error}`);
        throw error;
    }
  };