import { NextApiRequest } from 'next';

interface GuruApiReq extends NextApiRequest {
  [x: string]: any;
  userId: number;
}

export default GuruApiReq;