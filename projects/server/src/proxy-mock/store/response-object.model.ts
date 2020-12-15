import { OutgoingHttpHeaders } from 'http';

export interface ResponseObject {
    key: string;
    data: string;
    headers: OutgoingHttpHeaders;
    status: number;
    method: string;
    skip?: boolean;
}
