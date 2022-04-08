import { AzureFunction, Context, HttpRequest } from "@azure/functions"

interface HttpResponse {
    status: number;
    headers: {[name: string]: string};
    body: string;
}

export const httpTrigger: AzureFunction = async function (
    context: Context,
    req: HttpRequest
): Promise<void> {
    context.log.info("Detta är en logg");

    const body = {
        text: "I'm the joke :(!",
    }

    const res: HttpResponse = {
        status: 200,
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(body),
    };
    context.res = res;
};