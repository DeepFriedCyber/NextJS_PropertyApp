import { Adapter } from "next-auth/adapters";
export declare function format<T>(obj: Record<string, any>): T;
export declare const SupabaseAdapter: ({ url, secret, }: {
    url: string;
    secret: string;
}) => Adapter;
