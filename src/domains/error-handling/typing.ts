export type IErrorStructure = {
    source: string;
    message: string;
    code?: string | number;
    details?: unknown;
}