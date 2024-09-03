

export function GET(req:Request){
    const url = new URL(req.url)


    return Response.redirect(`${url.origin}/signinabc`)
} 