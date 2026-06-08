declare const config: {
    runtime: string;
};
declare function handler(req: Request): Promise<Response>;

export { config, handler as default };
