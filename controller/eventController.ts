import { Response, Request } from 'express';
import { event } from '../model/eventModel';
import { event_table } from '../util/database';
import uniqid from 'uniqid';
import moment from 'moment';

export const addEvent = async (req: Request, res: Response):Promise<any> => {
    
  try {
    const data:event = req.body;
    data.event_id = uniqid();
    const validateTime = moment(req.body.timestamp).isBefore(Date.now());
    if (validateTime == true) return res.status(401).json({
        statusCode:401,
        Message: "Invalid Timestemp passed!"
    })
    const add_event = event_table.insertOne(data);
    return res.status(200).json({
        statusCode:200,
        Message: "Event Added Successfully!!"
    })
    } catch (error) {
        return res.status(500).json({ Error: error });
    }
};