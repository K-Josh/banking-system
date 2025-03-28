'use server'

import { createBankAccountProps, exchangePublicTokenProps, signInProps, SignUpParams, User } from "@/types";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from '../utils';
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from "../plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla";

const {
    APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
    APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

export const signIn = async ({ email, password }: signInProps) => {
    try {
        const { account } = await createAdminClient();

        const res = await account.createEmailPasswordSession(email, password);
 
        return parseStringify(res);
    } catch (error) {
        console.error('Error', error);
    }
}

export const signUp = async ({ password, ...userData}: SignUpParams) => {
    const {email, firstName, lastName} = userData;

    let newUserAccount;

    try {
        const { account , database } = await createAdminClient();

       newUserAccount = await account.create(
        ID.unique(), 
        email, 
        password,
        `${firstName} ${lastName}`
        );
        
        if (!newUserAccount) throw new Error('Error creating user');
        console.log("Dwolla customer data:", userData);
        const dwollaCustomerUrl = await createDwollaCustomer({
            ...userData,
            type: 'personal',
        })

        if (!dwollaCustomerUrl) {
            console.error("Dwolla customer URL was not returned.");
            throw new Error("Error creating Dwolla customer: URL missing.");
        }

        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

        const newUser = await database.createDocument(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            ID.unique(),
            {
             ...userData,
             userId: newUserAccount.$id,
             dwollaCustomerId,
             dwollaCustomerUrl
            }
        )

        const session = await account.createEmailPasswordSession(email, password);
        
        (await cookies()).set("appwrite-session", session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(newUser);
    } catch (error) {
        console.error('Error', error);
    }
}

export async function getLoggedInUSer() {
    try {
        const {account} = await createSessionClient();
        const user = await account.get();

        return parseStringify(user);
    } catch(error) {
        return null; 
    }
}

export const logoutAccount = async () => {
    try {
        const { account } = await createAdminClient();

        (await cookies()).delete("appwrite-session");

        await account.deleteSession('current')
    } catch (error) {
        return null;
    }
}

export const createLinkToken = async (user: User) => {
   try {
     const tokenParams = {
        user: {
            client_user_id: user.$id
        },
        client_name: `${user.firstName} ${user.lastName}`,
        Products: ["auth"] as Products[],
        language: 'en',
        country_codes: ['CMR', 'NIG', 'US'] as CountryCode[],
     }

     const response = await plaidClient.linkTokenCreate(tokenParams);

     return parseStringify({linkToken: response.data.link_token})
   } catch (error) {
        console.log(error); 
   }
}

export const createBankAccount = async ({
    userId,
    bankId,
    accountId,
    accessToken,
    fundingSourceUrl,
    sharableId,
}: createBankAccountProps) => {
    try {
        const { database } = await createAdminClient();

        const bankAccount = await database.createDocument(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            ID.unique(),
            {
             userId,
             bankId,
             accountId,
             accessToken,
             fundingSourceUrl,
             sharableId,
            }
        )
        return parseStringify(bankAccount);
    } catch (error) {
        
    }
}

// now i create a public token function that allows us to exchange our existing access token and helps us to do stuffs.
export const exchangePublicToken = async ({
    publicToken, user,}: exchangePublicTokenProps) => {

        try {
            // exchange public tpken for access token and item_id
            const res = await plaidClient.itemPublicTokenExchange({
                public_token: publicToken,
            });

            const accessToken = res.data.access_token;
            const itemId = res.data.item_id;

            // get account info from plaid using the access token obtained
            const accountResponse = await plaidClient.accountsGet({
                access_token: accessToken,
            });

            const accountData = accountResponse.data.accounts[0];

            // create a processor token for Dwolla using the access token and account ID
            const req: ProcessorTokenCreateRequest = {
                access_token: accessToken,
                account_id: accessToken,
                processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
            };

            const processorTokenResponce = await plaidClient.processorTokenCreate(req);
            const processorToken = processorTokenResponce.data.processor_token;

            // create a funding source URL for the account using the Dwolla customer ID, processor token, and bank Name
            const fundingSourceUrl = await addFundingSource({
                dwollaCustomerId: user.dwollaCustomerId,
                processorToken,
                bankName: accountData.name
            });

            // if the funding source URL is not created, throw an error
            if(!fundingSourceUrl) throw Error;

        // create a bank account using the user ID, Item ID, account ID, Access token, dunding source URL, and a sharable ID
            await createBankAccount({
                userId: user.$id,
                bankId: itemId,
                accountId: accountData.account_id,
                accessToken,
                fundingSourceUrl,
                sharableId: encryptId(accountData.account_id),
            })

            revalidatePath("/");

            return parseStringify({
                publicTokenExchange: "complete"
            })
        } catch (error) {
            console.log(error);
            
        }
}

