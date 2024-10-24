import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
// Your own logic for dealing with plaintext password strings; be careful!
import { getUser } from "@/actions/users";
import { hashPassword } from "@/lib/utils";
import { ZodError } from "zod";
import { signInSchema } from "./lib/schemas";
declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      username: string;
      email: string;
      roleId: string;
      id: string;
      year: string;
    };
  }
  interface User {
    /** The user's postal address. */
    username?: string | null;
    email?: string | null;
    roleId: string;
    id?: string;
    year: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          let user = null;
          const { email, password } = await signInSchema.parseAsync(credentials);
          // logic to salt and hash password
          const pwHash = hashPassword(password);

          // logic to verify if the user exists
          user = await getUser({ username: email, password: pwHash });

          if (!user) {
            // No user found, so this is their first attempt to login
            // meaning this is also the place you could do registration
            throw new Error("User not found.");
          }

          // return user object with their profile data
          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.id = user.id;
        token.email = user.username;
        token.roleId = user.roleId;
        token.year = user.year;
      }
      return token;
    },
    session({ session, token, user }) {
      // `session.user.address` is now a valid property, and will be type-checked
      // in places like `useSession().data.user` or `auth().user`
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.email,
          roleId: token.roleId,
          year: token.year,
        },
      };
    },
  },
});
