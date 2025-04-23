export class Item {
    constructor(id, name, price, store) {
        this.id = id;
        this.name = String(name);
        this.price = Number(price);
        this.store = String(store);
    }
    jsonify() {
        return JSON.stringify({
            "id": this.id,
            "name": this.name,
            "price": this.price,
            "store": this.store
        });
    }
    static getColumns() {
        return 'id,name,price,store';
    }
    parseToCSV() {
        return `${this.id},${this.name},${this.price},${this.store}`;
    }
}