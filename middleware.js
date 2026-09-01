import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// માત્ર આ જ રૂટ્સ પ્રોટેક્ટેડ રહેશે
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/settings(.*)",
  "/admin(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  // જો રિક્વેસ્ટ ક્રોન જોબની હોય તો તેને ચેક ના કરો
  if (req.nextUrl.pathname.startsWith('/api/cron')) {
    return;
  }

  if (isProtectedRoute(req)) {
    const authObject = await auth();
    authObject.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};