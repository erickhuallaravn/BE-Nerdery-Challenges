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
    static printTable(items) {
        items.sort((curr, next) => curr.id - next.id);
        console.table(items.map(item => ({
            ID: item.id,
            Nombre: item.name,
            Precio: Number(item.price.toFixed(2)),
            Tienda: item.store
        })));
    }
}