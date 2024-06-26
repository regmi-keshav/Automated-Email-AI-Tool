import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import { ClientSecretCredential } from '@azure/identity';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const tenantId = process.env.OUTLOOK_TENANT_ID || '';
const clientId = process.env.OUTLOOK_CLIENT_ID || '';
const clientSecret = process.env.OUTLOOK_CLIENT_SECRET || '';

// Create the ClientSecretCredential
const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

// Create the TokenCredentialAuthenticationProvider
const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ['https://graph.microsoft.com/.default'],
});

// Create the Microsoft Graph Client
const client = Client.initWithMiddleware({
    authProvider,
});

export const getOutlookMessages = async () => {
    const response = await client.api('/me/messages').get();
    return response.value;
};

export const sendOutlookReply = async (messageId: string, replyText: string) => {
    const message = await client.api(`/me/messages/${messageId}`).get();
    const reply = {
        comment: 'Reply from automated tool',
        message: {
            subject: `Re: ${message.subject}`,
            body: {
                contentType: 'Text',
                content: replyText,
            },
            toRecipients: message.from,
        },
    };
    await client.api(`/me/messages/${messageId}/reply`).post(reply);
};
