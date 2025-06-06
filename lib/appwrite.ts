'use server'
import { cookies } from "next/headers"
import { Account, Client, Databases, Users } from "node-appwrite"

export async function createSessionClient() {
    const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)

//  creating a client session from the client on log in
    const session = (await cookies()).get("appwrite-session");
    if(!session || !session.value) {
        throw new Error("no session");
    }
    // we call the setSession and parse the session.value to it.
    client.setSession(session.value);

    return {
        get account() {
            return new Account(client);
        },
    };
} 

export async function createAdminClient() {
    const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!)

    return {
            get account() {
                return new Account(client);
            },
            get database() {
                return new Databases(client);
            },
            get user() {
                return new Users(client);
            },
        };
        
}