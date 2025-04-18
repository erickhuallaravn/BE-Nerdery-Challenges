import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';
import { Item } from './models/Item.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rl = readline.createInterface({ input, output });
const storageFilename = path.join(__dirname, 'data', 'wishlist.json');
const exportFilename = path.join(__dirname, 'data', 'wishlist.csv');

const mainMenu = async () => {
    let option = 0;
    while (option != 7) {
        try {
            console.clear();
            option = Number(await selectOption());
            switch (option) {
                case 1:
                    await addItem();
                    break;
                case 2:
                    await viewItems();
                    break;
                case 3:
                    await updateItem();
                    break;
                case 4:
                    await deleteItem();
                    break;
                case 5:
                    await exportToCSV();
                    break;
                case 6:
                    await getSummary();
                    break;
                case 7:
                    break;
            }
        } catch (error) {
            console.log(`FATAL ERROR: ${error.message}`);
        } finally {
            await rl.question('\nPress [Enter] to continue');
        }
    }
    console.log(`\nTHANKS FOR USING THE WISHLIST TRACKER`);
    rl.close();
}

const selectOption = async () => {
    const availableOptions = [1, 2, 3, 4, 5, 6, 7];
    console.log(`
        WELCOME TO WISHLIST TRACKER
        1 to add a new item
        2 to view all of the items
        3 to update one of the items
        4 to delete one or more items
        5 to export to CSV
        6 to show whishlist summary (most expensive item, average price, total cost, and the number of items)
        7 to exit
    `);
    const option = Number(await rl.question('Please type one of these options: '));
    if (isNaN(option) || !availableOptions.includes(option)) {
        throw new Error('The option selected is not a valid number');
    }
    return option;
}

const getItemsList = async () => {
    try {
        const data = await fs.readFile(storageFilename, 'utf-8');
        if (!data.trim()) return [];

        const rawItems = JSON.parse(data);
        const items = rawItems.map(i => new Item(i.id, i.name, i.price, i.store));
        return items;
    } catch (error) {
        if (error.code === 'ENOENT') return [];
        throw error;
    }
}

const addItem = async () => {
    try {
        console.log(`\nADDING A NEW ITEM`);
        const name = String(await rl.question('Please enter the new item name: '));
        const price = Number(await rl.question('Please enter the new item price: '));
        const store = String(await rl.question('Please enter the new item store: '));
        let items = await getItemsList();
        const lastId = items.length > 0
            ? items.reduce((max, item) => item.id > max ? item.id : max, 0)
            : 0;
        const newItem = new Item(lastId + 1, name, price, store);
        console.log(newItem.jsonify());
        const confirm = await rl.question('\nPlease press [enter] to confirm or any [other key] to cancel: ');
        if (String(confirm) === '') {
            items.push(newItem);
            await fs.writeFile(storageFilename, JSON.stringify(items));
            console.log('RESULT: Item added succesfully.');
        } else {
            console.log('RESULT: Item add operation cancelled.');
        }
    } catch (error) {
        throw error;
    }
}

const viewItems = async () => {
    try {
        console.log(`\nVIEWING ALL OF THE ITEMS IN WISHLIST`);
        const items = await fs.readFile(storageFilename, 'utf-8');
        console.log(items);
    } catch (error) {
        throw error;
    }
}

const updateItem = async () => {
    try {
        console.log(`\nUPDATING AN EXISTING ITEM`);
        const itemId = Number(await rl.question('Please enter the item ID to be updated: '));
        if (isNaN(itemId) || itemId <= 0) {
            throw new Error('The item ID provided is not valid');
        }
        let items = await getItemsList();
        const itemIndex = items.findIndex(i => i.id == itemId);

        if (itemIndex !== -1) {
            console.log('Item found!');
        } else {
            throw new Error('Item not found');
        }
        const name = await rl.question('Please type the new item name or press enter to skip: ');
        const price = await rl.question('Please type the new item price or press enter to skip: ');
        const store = await rl.question('Please type the new item store or press enter to skip: ');
        items[itemIndex].name = name !== '' ? name : items[itemIndex].name
        items[itemIndex].price = price !== '' ? price : items[itemIndex].price;
        items[itemIndex].store = store !== '' ? store : items[itemIndex].store
        await fs.writeFile(storageFilename, JSON.stringify(items));
        console.log('RESULT: Item updated succesfully.');
    } catch (error) {
        throw error;
    }
}

const deleteItem = async () => {
    try {
        console.log(`\nDELETING AN EXISTING ITEM`);
        const itemId = Number(await rl.question('Please enter the item ID to be deleted: '));
        if (isNaN(itemId) || itemId <= 0) {
            throw new Error("The item ID provided is not valid");
        }
        let items = await getItemsList();
        const itemIndex = items.findIndex(i => i.id == itemId);
        if (itemIndex !== -1) {
            console.log('Item found!');
        } else {
            throw new Error('Item not found');
        }
        items.splice(itemIndex, 1);
        await fs.writeFile(storageFilename, JSON.stringify(items));
        console.log('Item deleted succesufully!');
    } catch (error) {
        throw error;
    }
}

const exportToCSV = async () => {
    try {
        console.log(`\nEXPORTING WISHLIST TO A CSV FILE`);
        const items = await getItemsList();
        if (items.length === 0) {
            console.log('No items to export.');
            return;
        }
        let csvContent = 'name,price,store\n';
        csvContent += items.map(item => item.parseToCSV()).join('\n');
        await fs.writeFile(exportFilename, csvContent, 'utf-8');
        console.log('Wishlist exported to CSV successfully. The file is at:', exportFilename);
    } catch (error) {
        throw error;
    }
}

const getSummary = async () => {
    try {
        console.log(`\nSHOWING THE WISHLIST SUMMARY`);
        const items = await getItemsList();

        if (items.length === 0) {
            console.log('No items found in the wishlist.');
            return;
        }
        
        const mostExpensiveItem = items.reduce((prev, curr) => (prev.price > curr.price ? prev : curr));
        const itemsCount = items.length;
        let totalCost = 0;
        for (const item of items) totalCost += item.price;
        const averagePrice = totalCost / itemsCount;

        console.log(`\nThe most expensive item is:\n${mostExpensiveItem.jsonify()}`);
        console.log(`Average price: ${averagePrice.toFixed(2)}`);
        console.log(`Total cost: ${totalCost.toFixed(2)}`);
        console.log(`Number of items: ${itemsCount}`);
    } catch (error) {
        throw error;
    }
}

mainMenu();