import { OutgoingHttpHeaders } from 'http';
import { RequestMethod } from '@prm/shared';

export interface ResponseObject {
    key: string;
    data: string;
    headers: OutgoingHttpHeaders;
    status: number;
    method: RequestMethod;
    skip?: boolean;
}
