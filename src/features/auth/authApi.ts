import { apiSlice } from "@/app/apiSlice";

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateProfileData {
  name: string;
  //email: string;
}

export interface UpdatePasswordData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface RequestPasswordResetData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<void, LoginCredentials>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation<void, RegisterCredentials>({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => "/user",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<{ user: User }, UpdateProfileData>({
      query: (data) => ({
        url: "/user",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation<void, UpdatePasswordData>({
      query: (data) => ({
        url: "/user/password",
        method: "PUT",
        body: data,
      }),
    }),
    requestPasswordReset: builder.mutation<
      { message: string },
      RequestPasswordResetData
    >({
      query: (data) => ({
        url: "/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, ResetPasswordData>({
      query: (data) => ({
        url: "/reset-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
} = authApi;
