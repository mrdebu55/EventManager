import loki from "lokijs";
import { User } from "../model/userModel";
import { event } from "../model/eventModel";

const lokiDB = new loki("auth_db.json", {autosave: true,
 autosaveInterval: 100 ,
 autoload: true,
 persistenceMethod: 'localStorage'
});

const users_table = lokiDB.addCollection<User>("users",{autoupdate: true});
const event_table = lokiDB.addCollection<event>('event',{autoupdate: true});

export {lokiDB, users_table,event_table};
