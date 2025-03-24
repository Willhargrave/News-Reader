import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";


console.log("NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET);


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };