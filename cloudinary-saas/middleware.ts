import { clerkMiddleware,createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    "/signin",
    "/signup",
    "/",
    "/home"
])
const isPublicApiRoute = createRouteMatcher([
    "/api/videos"
])

export default clerkMiddleware((auth,req)=>{
    const {userId}= auth();
    const currentUrl = new URL(req.url)
    const isAccessingDashboard = currentUrl.pathname === "/home"
    const isApiRequest = currentUrl.pathname.startsWith("/api")

    if(userId && isPublicRoute(req) && !isAccessingDashboard){
        return NextResponse.redirect(new URL("/home",req.url))
    }
    // not logged in
    if(!userId){
        if(!isPublicRoute(req) && !isPublicApiRoute(req)){
            return NextResponse.redirect(new URL("/singin",req.url))
        }
        if(isApiRequest && isPublicApiRoute(req)){
            return NextResponse.redirect(new URL("/signin",req.url))
        }
    }
    return NextResponse.next()
})

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}