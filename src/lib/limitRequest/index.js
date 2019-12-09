class LimitPromise {
    constructor(max) {
        this._max = max;
        this._count = 0;
        this._taskQueue = [];
    }

    call(caller, ...args) {
        return new Promise((res, rej) => {
            const task = this._createTask(caller, args, res, rej);
            if (this._count >= this._max) {
                this._taskQueue.push(task)
            } else {
                task()
            }
        })
    }

    _createTask(caller, args, res, rej) {
        return () => {
            caller(...args).then(res).catch(rej).finally(() => {
                this._count--;
                if (this._taskQueue.length) {
                    let task = this._taskQueue.shift();
                    task()
                }
            })
            this._count++
        }
    }
}

export { LimitPromise }