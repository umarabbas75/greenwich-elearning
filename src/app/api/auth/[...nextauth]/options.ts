import axios from 'axios';
import CredentialsProvider from 'next-auth/providers/credentials';
export const options = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      // The credentials are used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'johndoe@email.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const payload = {
          email: email,
          password: password,
        };

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URI}/api/login/`,
            {
              method: 'POST',
              body: JSON.stringify(payload),
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
          const user = await res.json();
          //adding this temporarily-start
          return {
            ...user,
            access: '123345dfg4354r23c2d423x',
            refresh: '35434c4d435364554',
            first_name: user?.first_name ?? 'umar',
            last_name: user?.last_name ?? 'abbas',
            email: user?.email ?? 'umarabbas75@gmail.com',
            id: user?.id ?? '12345',
            photo:
              user?.photo ??
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXuzt2s8nfTKBrSQTx1lNn9M8vIRY0xujttj2HD75gu1yTGxF8Gz75KAMpWf1qlgMlV_U&usqp=CAU',
            role: user?.role ?? 'admin',
          } as any;
          //adding this temporarily-end
          if (!res.ok) {
            throw new Error(user.detail ?? 'Something went wrong');
          }
          console.log({ user });
          return {
            ...user,
            access: user?.access,
            refresh: user?.refresh,
            first_name: user?.first_name,
            last_name: user?.last_name,
            email: user?.email,
            id: user?.id,
            photo: user?.photo,
            role: user?.role,
          } as any;
        } catch (error) {
          if (error instanceof Error) {
            //  fetch(
            //   `${process.env.NEXT_PUBLIC_API_URI}/api/login/`,
            //   {
            //     method: 'POST',
            //     body: JSON.stringify(payload),
            //     headers: {
            //       'Content-Type': 'application/json',
            //     },
            //   },
            // );
            throw new Error(error.message ?? 'Something went wrong');
          } else {
            throw new Error('Something went wrong');
          }
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, account, session, trigger }: any) {
      if (trigger === 'update' && session?.first_name && session?.last_name) {
        const formData = new FormData();
        formData.append('first_name', session.first_name);
        formData.append('last_name', session.last_name);

        try {
          const axiosOptions = {
            method: 'patch', // Use lower case for HTTP methods in Axios
            url: `${process.env.NEXT_PUBLIC_API_URI}/api/users/${token.id}/`,
            data: formData, // Use 'data' instead of 'body' for FormData in Axios
            headers: {
              'Content-Type': 'multipart/form-data', // Set the content type for FormData
              Authorization: `Bearer ${token.access}`, // Add custom headers here
            },
          };

          const res = await axios(axiosOptions);

          console.log('resss', res);

          if (res.status === 200) {
            token.first_name = session.first_name;
            token.last_name = session.last_name;
          } else {
            //console.error('Failed to update user');
          }
        } catch (error) {
          //console.error('Error updating user:', error);
          console.log('errror', error);
        }
      }
      if (trigger === 'update' && session.photo) {
        token.photo = session.photo;
      }
      if (trigger === 'update' && session.access && session.refresh) {
        token.access = session.access;
        token.refresh = session.refresh;
      }
      console.log({ token });
      if (account && user) {
        return {
          ...token,
          ...user,
        };
      }

      return token;
    },

    async session({ session, token }: any) {
      console.log('token', token);
      session.user = token;

      return session;
    },
  },
};
