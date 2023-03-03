interface CacheItem<T = any> {
    scrollTop: number;
    data: T;
}

export class PageCache {
    private readonly map: Map<string, CacheItem> = new Map();
    private latest: { url: string; cacheItem: CacheItem };

    create(url: string) {
        let uc = this.map.get(url);
        if (!uc) {
            this.map.set(url, { scrollTop: undefined, data: undefined });
        }
    }
    setScrollTop(url: string, scrollTop: number) {
        let cacheItem = this.map.get(url);
        if (cacheItem) {
            cacheItem.scrollTop = scrollTop;
        }
        else {
            cacheItem = { scrollTop, data: undefined };
            this.map.set(url, cacheItem);
        }
        this.latest = { url, cacheItem };
    }
    setData<T = any>(url: string, data: T) {
        let cacheItem = this.map.get(url);
        if (cacheItem) {
            cacheItem.data = data;
        }
        else {
            cacheItem = { scrollTop: undefined, data };
            this.map.set(url, cacheItem);
        }
        this.latest = { url, cacheItem };
    }
    get<T = any>(url: string): CacheItem<T> {
        return this.map.get(url);
    }
    getData<T = any>(url: string): T {
        let ret = this.map.get(url);
        return ret?.data;
    }
    getLatestItem<T>(): CacheItem<T> {
        return this.latest?.cacheItem;
    }
}
