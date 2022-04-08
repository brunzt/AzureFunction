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

export const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest,
    inputDocument: Iimage
): Promise<HttpResponse> {
    
    context.log.info("func-http-post-images logg");

    const res: HttpResponse = {
        status: 202,
        headers: {
            "content-type": "application/octet-stream"
        },
        body: inputDocument,
    };
    return res
};