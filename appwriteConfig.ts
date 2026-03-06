import { Client, TablesDB, Account, ID, Query, Functions, Realtime } from "appwrite";

const client = new Client();
    client.setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT);
    client.setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);
    
    

const db = new TablesDB(client);
const account = new Account(client);
const functions = new Functions(client);
const realtime = new Realtime(client);

export { client, db, account, ID, Query, functions, realtime };
