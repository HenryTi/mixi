export abstract class LocalDb {
    abstract getItem(key: string): string;
    abstract setItem(key: string, value: string): void;
    abstract removeItem(key: string): void;

    createLocalMap(name: string): LocalMap {
        return new LocalMap(this, name);
    }
}

export class LocalMapDb extends LocalDb {
    private readonly map: Map<string, string>;
    constructor() {
        super();
        this.map = new Map<string, string>();
    }

    getItem(key: string): string {
        return this.map.get(key);
    }
    setItem(key: string, value: string) {
        this.map.set(key, value);
    }
    removeItem(key: string) {
        this.map.delete(key);
    }
}

// const __ls = new _LocalStorage(); // new Ls;

export class LocalCache {
    private readonly local: Local;
    readonly key: string | number;

    constructor(local: Local, key: string | number) {
        this.local = local;
        this.key = key;
    }
    get(): any {
        try {
            // 下面缓冲的内容不能有，可能会被修改，造成circular引用
            //if (this.value !== undefined) return this.value;
            let text = this.local.getItem(this.key);
            if (text === null) return;
            if (text === undefined) return undefined;
            //return this.value = 
            return JSON.parse(text);
        }
        catch (err) {
            this.local.removeItem(this.key);
            return;
        }
    }
    set(value: any) {
        let t = JSON.stringify(value, (key, value) => {
            if (key !== '_tuid') return value;
        });
        this.local.setItem(this.key, t);
    }
    remove(local?: Local) {
        if (local === undefined) {
            this.local.removeItem(this.key);
        }
        else {
            this.local.removeLocal(local);
        }
    }
    child(key: string | number): LocalCache {
        return this.local.child(key);
    }
    arr(key: string | number): LocalArr {
        return this.local.arr(key);
    }
    map(key: string | number): LocalMap {
        return this.local.map(key);
    }
}

abstract class Local {
    private readonly caches: { [key: string]: LocalCache };
    private readonly locals: { [key: string]: Local };
    protected readonly localDb: LocalDb;
    protected readonly name: string;
    constructor(localDb: LocalDb, name: string) {
        this.localDb = localDb;
        this.name = name;
        this.caches = {};
        this.locals = {};
    }

    protected abstract keyForGet(key: string | number): string;
    protected abstract keyForSet(key: string | number): string;
    protected abstract keyForRemove(key: string | number): string;
    abstract removeAll(): void;
    getItem(key: string | number): string {
        let k = this.keyForGet(key);
        if (k === undefined) return;
        return this.localDb.getItem(k);
    }
    setItem(key: string | number, value: string): void {
        let k = this.keyForSet(key);
        this.localDb.setItem(k, value);
    }
    removeItem(key: string | number): void {
        let k = this.keyForRemove(key);
        if (k === undefined) return;
        localStorage.removeItem(k);
    }
    arr(key: string | number): LocalArr {
        let sk = String(key);
        let arr = this.locals[sk] as LocalArr;
        if (arr === undefined) {
            let k = this.keyForSet(key);
            this.locals[sk] = arr = new LocalArr(this.localDb, k);
        }
        return arr;
    }
    map(key: string | number): LocalMap {
        let sk = String(key);
        let map = this.locals[sk] as LocalMap;
        if (map === undefined) {
            let k = this.keyForSet(key);
            this.locals[sk] = map = new LocalMap(this.localDb, k);
        }
        return map;
    }
    removeLocal(local: Local) {
        let sk = local.name;
        let k = this.keyForRemove(sk);
        if (k === undefined) return;
        let arr = this.locals[sk];
        if (arr === undefined) arr = new LocalArr(this.localDb, k);
        else this.locals[sk] = undefined;
        arr.removeAll();
    }
    child(key: string | number): LocalCache {
        let ks = String(key);
        let ret = this.caches[ks];
        if (ret !== undefined) return ret;
        return this.caches[ks] = ret = new LocalCache(this, key);
    }
}

const maxArrSize = 500;
export class LocalArr extends Local {
    private readonly index: number[];
    constructor(localDb: LocalDb, name: string) {
        super(localDb, name);
        let index = this.localDb.getItem(this.name);
        if (index) {
            this.index = index.split('\n').map(v => Number(v));
        }
        else {
            this.index = [];
        }
    }
    private saveIndex() {
        this.localDb.setItem(this.name, this.index.join('\n'));
    }
    protected keyForGet(key: number): string {
        let i = this.index.indexOf(key);
        if (i < 0) return undefined;
        return `${this.name}.${key}`;
    }
    protected keyForSet(key: number): string {
        let i = this.index.indexOf(key);
        if (i < 0) {
            this.index.unshift(key);
            if (this.index.length > maxArrSize) this.index.pop();
        }
        else {
            this.index.splice(i, 1);
            this.index.unshift(key)
        }
        this.saveIndex();
        return `${this.name}.${key}`;
    }
    protected keyForRemove(key: number): string {
        let i = this.index.indexOf(key);
        if (i < 0) return;
        this.index.splice(i, 1);
        this.saveIndex();
        return `${this.name}.${key}`;
    }
    removeAll(): void {
        for (let i of this.index) {
            this.localDb.removeItem(`${this.name}.${i}`);
        }
        this.localDb.removeItem(this.name);
        this.index.splice(0);
    }
    item(index: number): LocalCache {
        return this.child(index);
    }
}

export class LocalMap extends Local {
    private readonly index: { [key: string]: number };
    private max: number;
    constructor(localDb: LocalDb, name: string) {
        super(localDb, name);
        this.max = 0;
        this.index = {};
        let index = this.localDb.getItem(this.name);
        if (index) {
            let ls = index.split('\n');
            ls.forEach(l => {
                let p = l.indexOf('\t');
                if (p < 0) return;
                let key = l.substr(0, p);
                let i = Number(l.substr(p + 1));
                if (isNaN(i) === true) return;
                this.index[key] = i;
                if (i > this.max) this.max = i;
            });
        }
    }
    private saveIndex() {
        let ls: string[] = [];
        for (let k in this.index) {
            let v = this.index[k];
            if (v === undefined) continue;
            ls.push(`${k}\t${v}`);
        }
        this.localDb.setItem(this.name, ls.join('\n'));
    }
    protected keyForGet(key: number): string {
        let i = this.index[key];
        if (i === undefined) return undefined;
        return `${this.name}.${i}`;
    }
    protected keyForSet(key: number): string {
        let i = this.index[key];
        if (i === undefined) {
            ++this.max;
            i = this.max;
            this.index[key] = i;
            this.saveIndex();
        }
        return `${this.name}.${i}`;
    }
    protected keyForRemove(key: string | number): string {
        let i = this.index[key];
        if (i === undefined) return;
        this.index[key] = undefined;
        this.saveIndex();
        return `${this.name}.${i}`;
    }
    removeAll(): void {
        for (let i in this.index) {
            this.localDb.removeItem(`${this.name}.${this.index[i]}`);
            this.index[i] = undefined;
        }
        this.localDb.removeItem(this.name);
        this.max = 0;
    }
    item(key: string): LocalCache {
        return this.child(key);
    }
}
