import { NextResponse } from "next/server";

interface IParams {
  conversationId: string;
}

export async function(request: Request, {params}: {params: IParams}){
    try{

    }catch(error:any){
        console.log('ERROR MESSAGE SEEN')
        return new NextResponse('INTERNAL ERROR', {status: 500})
    }
}
