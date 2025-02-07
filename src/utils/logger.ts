type LogType = 'request' | 'response' | 'error';

class Logger {
    private isDev: boolean;
    private styles: Record<LogType, string>;

    constructor() {
        this.isDev = process.env.NODE_ENV === 'development';
        this.styles = {
            request: 'background: #67C23A; color: #fff; padding: 2px 4px; border-radius: 2px;',
            response: 'background: #409EFF; color: #fff; padding: 2px 4px; border-radius: 2px;',
            error: 'background: #F56C6C; color: #fff; padding: 2px 4px; border-radius: 2px;'
        };
    }

    public log(type: LogType, data: any) {
        if (!this.isDev) return;
        
        console.log(
            `%c${type.toUpperCase()}`,
            this.styles[type],
            data
        );
    }
}

export default new Logger();