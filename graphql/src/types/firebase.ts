import {
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { extendType, nonNull, objectType, stringArg } from 'nexus';

export const AuthResponse = objectType({
  name: 'AuthResponse',
  definition(t) {
    t.field('status', { type: 'status' }), t.string('message');
  },
});

export const FirebaseQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('signIn', {
      type: AuthResponse,
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_, { email, password }, { auth }) => {
        const user: UserCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        if (!user) return { status: 'error', message: 'Invalid credentials' };
        return {
          status: 'success',
          message: 'User signed in',
          data: user,
        };
      },
    }),
    t.field('signOut', {
      type: AuthResponse,
      resolve: async (_, __, { auth }) => {
        let status: 'success' | 'error' = 'error';
        const user = signOut(auth)
          .then(() => {
            status = 'success';
            return {
              status,
              message: 'User signed out',
            };
          })
          .catch(() => {
            return {
              status,
              message: 'User sign out failed',
            };
          });
        return user;
      },
    });
  },
});

export const FirebaseMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createAccount', {
      type: AuthResponse,
      args: {
        name: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_, { name, email, password }, { auth }) => {
        let status: 'success' | 'error' = 'error';
        const user = createUserWithEmailAndPassword(auth, email, password)
          .then(() => {
            auth.currentUser && updateProfile(auth.currentUser, { displayName: name });
            status = 'success';
            return {
              status,
              message: 'User created and logged in',
            };
          })
          .catch((err) => {
            return {
              status,
              message: err.message,
            };
          });
        return user;
      },
    });
  },
});
