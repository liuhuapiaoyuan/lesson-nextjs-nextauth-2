

export function GET(){
    return Response.json({ message:"success"})
}
export async function POST(req:Response){
    const text = await req.text()
    console.log("接收到内容",text)
    // 这里一但处理成功，前端页面就要成功 成功跳转到callback，以及对应的code
    
    return Response.json({ message:"success",access_token:"xxxxx",token_type:"bearer"})
}