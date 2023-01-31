export function usePromise<T>(promise: Promise<T>): T {
    let p = promise as any;
    switch (p.status) {
        case 'fulfilled': return p.value;
        case 'rejected': throw p.reason;
        case 'pending': throw p;
        default:
            p.status = 'pending';
            p.then(
                (result: any) => {
                    p.status = 'fulfilled';
                    p.value = result;
                },
                (reason: any) => {
                    p.status = 'rejected';
                    p.reason = reason;
                },
            );
            throw p;
    }
}
