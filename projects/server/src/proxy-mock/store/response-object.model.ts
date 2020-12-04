import { OutgoingHttpHeaders } from 'http';

export interface ResponseObject {
    key: string;
    data: string;
    headers: OutgoingHttpHeaders;
    status: number;
    skip?: boolean;
}
