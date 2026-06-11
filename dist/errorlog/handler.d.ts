declare const config: {
    maxDuration: number;
};
type NodeHeaders = Record<string, string | string[] | undefined>;
type NodeRequestLike = {
    method?: string;
    headers?: NodeHeaders;
    body?: unknown;
    connection?: {
        remoteAddress?: string;
    };
    socket?: {
        remoteAddress?: string;
    };
};
type NodeResponseLike = {
    status(code: number): NodeResponseLike;
    setHeader(name: string, value: string): void;
    end(body?: string): void;
};
declare function handler(req: Request | NodeRequestLike, res?: NodeResponseLike): Promise<Response | void>;

export { config, handler as default };
