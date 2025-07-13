# OAuth 2.0 Setup Guide for MediSecure

This guide will help you set up OAuth 2.0 authentication for your MediSecure application.

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# OAuth Providers

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# Microsoft Azure AD OAuth
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
MICROSOFT_TENANT_ID=your_microsoft_tenant_id
```

## Setting up OAuth Providers

### 1. Google OAuth

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Set the authorized redirect URI to: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env.local` file

### 2. GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: MediSecure
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env.local` file

### 3. Microsoft Azure AD OAuth

1. Go to the [Azure Portal](https://portal.azure.com/)
2. Navigate to Azure Active Directory > App registrations
3. Click "New registration"
4. Fill in the application details:
   - Name: MediSecure
   - Redirect URI: `http://localhost:3000/api/auth/callback/azure-ad`
5. Copy the Application (client) ID and create a client secret
6. Copy the Directory (tenant) ID
7. Add these values to your `.env.local` file

## Generating NextAuth Secret

Generate a secure random string for `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

Or use an online generator and ensure it's at least 32 characters long.

## Database Setup

The OAuth integration uses the existing Supabase database structure. Make sure your `profiles` table has the following columns:

- `id` (UUID, primary key)
- `email` (text)
- `full_name` (text)
- `avatar_url` (text, nullable)
- `role` (text, default: 'patient')
- `is_onboarded` (boolean, default: false)

## Testing OAuth

1. Start your development server: `pnpm dev`
2. Navigate to `/auth/login` or `/auth/signup`
3. Click on any OAuth provider button
4. Complete the OAuth flow
5. You should be redirected to the dashboard after successful authentication

## Production Deployment

For production deployment:

1. Update `NEXTAUTH_URL` to your production domain
2. Update all OAuth provider redirect URIs to use your production domain
3. Ensure all environment variables are set in your production environment
4. Use a strong, unique `NEXTAUTH_SECRET` for production

## Security Considerations

- Never commit your `.env.local` file to version control
- Use strong, unique secrets for production
- Regularly rotate OAuth client secrets
- Monitor OAuth usage and implement rate limiting if needed
- Consider implementing additional security measures like MFA for sensitive roles

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**: Ensure the redirect URI in your OAuth provider settings matches exactly with your application's callback URL
2. **"Client ID not found" error**: Verify your OAuth client IDs and secrets are correctly set in your environment variables
3. **"Session not found" error**: Check that `NEXTAUTH_SECRET` is properly set and consistent across deployments

### Debug Mode

To enable debug mode for NextAuth, add this to your `.env.local`:

```env
NEXTAUTH_DEBUG=true
```

This will provide more detailed error messages in the console. 