import { CosmosClient } from "@azure/cosmos";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid"

interface HttpResponse {
    status: number;
    headers: {[name: string]: string};
    body: Iimage;
}

interface Iimage {
    id : string
    uri : string
}

const createId = (): string => {
    return uuidv4() + ".jpg"
}
// The function receives an image as binary data in a HTTP request
// • The function should use the Azure blob storage SDK to store the image in a storage
// account, i.e. the BlobServiceClient from the @azure/storage-blob npm package.
// • The function should create a document in Cosmos DB through an output binding
// • If you need to generate unique ids, you can use a npm package called uuid

export const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<HttpResponse> {
    
    context.log.info("func-http-post-images logg");
    const newPicId = createId();
    // const client = new CosmosClient(process.env.COSMOS_CONNECTION_STRING);
    // const container = client.database("azure101").container("images")
    // const item = await container.item("1","1").read<Iimage>();
    
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.Storage_account_connection_string);
    const containerClient = blobServiceClient.getContainerClient("images");

    const blockBlobClient = containerClient.getBlockBlobClient(newPicId);
    const uploadBlobResponse = await blockBlobClient.uploadData(req.body);
    console.log(`Upload block blob ${newPicId} successfully`, uploadBlobResponse.requestId);


    console.log(blockBlobClient.url)
    
    const imagebinding : Iimage = context.bindings.outputCosmosDbDocument = {
        id : newPicId,
        uri : blockBlobClient.url
    }

    context.bindings.outputSbMsg = imagebinding;

    const res: HttpResponse = {
        status: 201,
        headers: {
            "content-type": "application/octet-stream"
        },
        body: imagebinding,
    };
    return res
};