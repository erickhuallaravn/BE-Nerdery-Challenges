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
        await fs.mkdir(path.dirname(storageFilename), {recursive: true});

        const fileHandle = await fs.open(storageFilename, 'a+');
        const fileContent = await fileHandle.readFile('utf-8');
        if (!fileContent.trim()) return [];

        const rawItems = JSON.parse(fileContent);
        await fileHandle.close();
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
        let price = Number(await rl.question('Please enter the new item price: '));
        while (isNaN(price) || price < 0) {
            price = Number(await rl.question('\tPlease enter a valid item price: '));
        }
        const store = String(await rl.question('Please enter the new item store: '));
        let items = await getItemsList();
        const lastId = items.length > 0
            ? items.sort((curr, next) => next.id - curr.id)[0].id
            : 0;
        const newItem = new Item(lastId + 1, name, price, store);
        Item.printTable([newItem]);
        const confirm = String(await rl.question('\nPlease press [enter] to confirm or any [other key] to cancel: '));
        if (confirm === '') {
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
        const items = await getItemsList();
        Item.printTable(items);
    } catch (error) {
        throw error;
    }
}

const updateItem = async () => {
    try {
        console.log(`\nUPDATING AN EXISTING ITEM`);
        let items = await getItemsList();
        Item.printTable(items);
        const itemId = Number(await rl.question('Please enter the item ID to be updated: '));
        if (isNaN(itemId) || itemId <= 0) {
            throw new Error('The item ID provided is not valid');
        }
        const itemIndex = items.findIndex(i => i.id == itemId);

        if (itemIndex !== -1) {
            console.log('Item found!');
            Item.printTable([items[itemIndex]]);
        } else {
            throw new Error('Item not found');
        }
        const name = String(await rl.question('Please type the new item name or press enter to skip: '));
        let price = Number(await rl.question('Please type the new item price or press enter to skip: '));
        while (isNaN(price) || price < 0) {
            price = Number(await rl.question('\tPlease enter a valid item price: '));
        }
        const store = String(await rl.question('Please type the new item store or press enter to skip: '));
        items[itemIndex].name = name !== '' ? name : items[itemIndex].name
        items[itemIndex].price = price !== '' ? price : items[itemIndex].price;
        items[itemIndex].store = store !== '' ? store : items[itemIndex].store;
        console.clear();
        Item.printTable([items[itemIndex]]);

        await fs.writeFile(storageFilename, JSON.stringify(items));
        console.log('RESULT: Item updated succesfully.');
    } catch (error) {
        throw error;
    }
}

const deleteItem = async () => {
    try {
        console.log(`\nDELETING AN EXISTING ITEM`);
        let items = await getItemsList();
        Item.printTable(items);
        const itemId = Number(await rl.question('Please enter the item ID to be deleted: '));
        if (isNaN(itemId) || itemId <= 0) {
            throw new Error("The item ID provided is not valid");
        }
        const itemIndex = items.findIndex(i => i.id == itemId);
        if (itemIndex !== -1) {
            console.log('Item found!');
            Item.printTable([items[itemIndex]]);
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
        let csvContent = Item.getColumns() + '\n';
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

        console.log('\nThe most expensive item is:');
        Item.printTable([mostExpensiveItem])
        console.log(`Average price: ${averagePrice.toFixed(2)}`);
        console.log(`Total cost: ${totalCost.toFixed(2)}`);
        console.log(`Number of items: ${itemsCount}`);
    } catch (error) {
        throw error;
    }
}

mainMenu();