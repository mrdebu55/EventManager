import { User } from "../model/userModel";
import { event_table } from "../util/database";
import moment from 'moment';

export const socketConnection = (socket:any):void => {
  try {
    socket.on('Hello', (user:User) => {
      getReminderWithInterval(socket,user);
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getReminderWithInterval = (socket:any,user:User):void=>{
  try {
    const interval = setInterval(()=>{
      const data = event_table.where(function(obj) {
        return (obj.username == user.username && moment().isSameOrAfter(moment(obj.timestamp)));
      });
      socket.emit('reminder',data);
    },5000);
  } catch (error) {
    throw new Error(error);    
  }
};