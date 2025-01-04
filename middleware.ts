// import { NextResponse } from "next/server";
// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware((req) => {
//   const { userId } = req.auth;

//   // If user is authenticated and not on /dashboard, redirect them to /dashboard
//   if (userId && !req.nextUrl.pathname.startsWith("/dashboard")) {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   // Allow the request to proceed for unauthenticated users or requests to /dashboard
//   return NextResponse.next();
// });

// export const config = {
//   matcher: [
//     // Define routes to include in the middleware
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     "/(api|trpc)(.*)",
//   ],
// };
