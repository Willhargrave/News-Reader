import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { v4 as uuidv4 } from "uuid";


export const users: { id: string; username: string; password: string }[] = [

  { id: uuidv4(), username: "testuser", password: "password123" },
];

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = users.find(
          (u) =>
            u.username === credentials?.username &&
            u.password === credentials?.password
        );
        if (user) {
          return { id: user.id, name: user.username };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "my-secret", 
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
