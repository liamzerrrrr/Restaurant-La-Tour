import 'server-only';
// No provider SDK, HTTP transport, or scheduled sender is wired in this version.
// Explicit enablement alone is insufficient until the transport has been implemented and tested.
export async function sendSMS():Promise<never>{throw Error('SMS_TRANSPORT_NOT_CONNECTED');}
