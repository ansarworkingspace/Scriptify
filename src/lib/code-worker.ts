const executeCode = (code: string) => {
    try {
        // Override console methods to capture output
        const outputs: string[] = [];
        const console = {
            log: (...args: any[]) => {
                outputs.push(args.map(arg =>
                    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                ).join(' '));
            },
            error: (...args: any[]) => {
                outputs.push(`Error: ${args.join(' ')}`);
            },
            warn: (...args: any[]) => {
                outputs.push(`Warning: ${args.join(' ')}`);
            }
        };

        // Execute code in a new Function context with console overrides
        new Function('console', code)(console);

        return { success: true, output: outputs };
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
            output: [`Error: ${error.message}`]
        };
    }
};

self.addEventListener('message', (event) => {
    const result = executeCode(event.data);
    self.postMessage(result);
});