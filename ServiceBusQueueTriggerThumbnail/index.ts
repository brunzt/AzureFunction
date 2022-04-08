import { AzureFunction, Context } from "@azure/functions"
import resizeImg from "resize-img"
import { Buffer } from 'buffer'


interface Message {
    name: string;
}

interface Document {
    id: string
    uri: string
}

interface OutDocument {
    id: string
    uri: string
    thumbnail: string
}

const serviceBusQueueTrigger: AzureFunction = async function (
    context: Context,
    mySbMsg: Message,
    inputBlob: Buffer,
    inputDocument: Document
    ): Promise<void> {
    
        
    const resizedImage = await resizeImg(inputBlob, {
        width: 128,
        height: 128
        })

        context.bindings.outputBlob = resizedImage;

        context.log(context.bindings.outputBlob);
        context.log(context.bindingData.blob);
        context.log(context.bindings.outputBlob.uri);

        context.bindings.outputDocument = {
            ...inputDocument,
            thumbnail: context.bindings.outputBlob.bindingData.url
        };

        context.log(context.bindings.outputDocument);
};

export default serviceBusQueueTrigger;
