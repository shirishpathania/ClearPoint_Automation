const { test, expect } = require('@playwright/test');

const addItemRequest = JSON.parse(JSON.stringify(require('../test_data/item_description.json')));

// Test Case # 1: Submit POST Add Item API request and verify GET Item request returns item details
test.describe('Add item and get item details', () => {

    for (const data in addItemRequest) { // Please refer to test_data -> item_description.json for test data

        test(`Add item ${addItemRequest[data].description}`, async ({request}) => {

            // Add a new item
            const addItemResponse = await request.post('/api/todoItems', {
                data: {description: `${addItemRequest[data].description}`}
            });
            console.log(await addItemResponse.json());
            expect(addItemResponse.ok()).toBeTruthy();
            const itemId = await addItemResponse.json();

            // Get newly added item details
            const getItemResponse = await request.get(`/api/todoItems/${itemId}`);
            console.log(await getItemResponse.json());
            expect(getItemResponse.ok()).toBeTruthy();

        });
    };
});

// Test Case # 2: Submit GET Item List API request and update item details using PUT request
test.describe('Get item list and update the description', () => {

    test('Get item list', async ({request}) => {
    
        // Get item list
        const getItemListResponse = await request.get(`/api/todoItems`);
        console.log(await getItemListResponse.json());
        expect(getItemListResponse.ok()).toBeTruthy();
        const itemCount = JSON.parse(await getItemListResponse.text());
  
        for (const items in itemCount) {
            
            // Update item status to complete
            const updateItemResponse = await request.put(`/api/todoItems/{${itemCount[items].id}}`, {
                data: {id: `${itemCount[items].id}`, description: `${itemCount[items].description}`, isCompleted: true}
            });
            expect(updateItemResponse.ok()).toBeTruthy();

        }
    });
});