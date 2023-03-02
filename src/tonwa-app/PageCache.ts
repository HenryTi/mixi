interface CacheItem<T = any> {
    scrollTop: number;
    data: T;
}

export class PageCache {
    private readonly map: Map<string, CacheItem> = new Map();

    create(url: string) {
        let uc = this.map.get(url);
        if (!uc) {
            this.map.set(url, { scrollTop: undefined, data: undefined });
        }
    }
    setScrollTop(url: string, scrollTop: number) {
        let uc = this.map.get(url);
        if (uc) {
            uc.scrollTop = scrollTop;
            return;
        }
        this.map.set(url, { scrollTop, data: undefined });
    }
    setData<T = any>(url: string, data: T) {
        let uc = this.map.get(url);
        if (uc) {
            uc.data = data;
            return;
        }
        this.map.set(url, { scrollTop: undefined, data });
    }
    get<T = any>(url: string): CacheItem<T> {
        return this.map.get(url);
    }
}
