// api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthResponse, UserData } from '../types/Types';

const USER_URL = 'api/user';

const baseQuery = fetchBaseQuery({ baseUrl: '' });

export const apiSlice = createApi({
    baseQuery,
    endpoints: (builder) => ({
        signUp: builder.mutation<AuthResponse, UserData>({
            query: (data) => ({
                url: `${USER_URL}/signup`,
                method: 'POST',
                body: data,
            }),
        }),
        removeSocialAccount: builder.mutation<UserData, { provider: string }>({
            query: (data) => ({
                url: `${USER_URL}/remove-social-account`,
                method: 'DELETE',
                body: data,
            }),
        }),
        login: builder.mutation<AuthResponse, UserData>({
            query: (data) => ({
                url: `${USER_URL}/login`,
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useSignUpMutation, useLoginMutation, useRemoveSocialAccountMutation } = apiSlice;
