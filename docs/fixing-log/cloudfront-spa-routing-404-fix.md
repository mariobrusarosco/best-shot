# Fixing CloudFront 404 Error for SPA Root Route

**Date:** November 2, 2025  
**Issue:** Root route (`/`) returns 404 in staging/production but works in localhost  
**Environment:** AWS S3 + CloudFront deployment  
**Status:** ✅ Solution Identified - Awaiting CloudFront Configuration

---

## 🔍 Problem Description

### Symptom
- Visiting `https://best-shot-demo.mariobrusarosco.com/` returns a 404 error
- The application works perfectly on `localhost:5173/`
- Direct navigation to specific routes (e.g., `/dashboard`, `/login`) also fails with 404

### Root Cause
This is a **classic Single Page Application (SPA) routing issue** with static hosting on CloudFront/S3.

**What's happening:**
1. User visits `https://best-shot-demo.mariobrusarosco.com/`
2. CloudFront/S3 tries to find a file at the exact path `/`
3. Since there's no file at that path (only `/index.html`), it returns 404
4. The React application never loads, so the routing logic never executes
5. User sees a 404 error instead of the app

**Why it works locally:**
- Vite's dev server is configured to serve `index.html` for all routes automatically
- This is standard behavior for SPA development servers

**Why it fails in production:**
- CloudFront/S3 serves static files exactly as they exist in the bucket
- Without configuration, it doesn't know to serve `index.html` for non-file paths
- It treats every route as a request for a specific file

---

## 🎯 The Solution

Configure CloudFront to serve `index.html` with a 200 status code for all 404 and 403 errors. This allows:

1. Static assets (JS, CSS, images) to be served normally
2. Any non-existent path to load `index.html`
3. The React app to load and TanStack Router to handle the routing
4. Authentication logic to execute properly

---

## 🛠️ Implementation Steps

### Step 1: Access CloudFront Console

1. Go to [AWS CloudFront Console](https://console.aws.amazon.com/cloudfront)
2. Sign in with your AWS credentials
3. Locate your distribution:
   - Find the distribution ID that matches your `AWS_CLOUDFRONT_ID` GitHub secret
   - For staging: Look for the distribution serving `best-shot-demo.mariobrusarosco.com`
   - For production: Look for the distribution serving your production domain

### Step 2: Configure Custom Error Responses

1. Click on your CloudFront distribution ID to open its details
2. Navigate to the **Error Pages** tab
3. Click **Create Custom Error Response**

### Step 3: Add 404 Error Response

Configure the first custom error response:

```
HTTP Error Code:           404: Not Found
Customize Error Response:  Yes
Response Page Path:        /index.html
HTTP Response Code:        200: OK
```

**Why these settings:**
- **404 Error**: Triggered when CloudFront can't find a file at the requested path
- **Response Page Path `/index.html`**: Serves your SPA entry point
- **200 Status Code**: Returns success instead of error (important for SEO and user experience)

Click **Create Custom Error Response**

### Step 4: Add 403 Error Response

Create a second custom error response:

```
HTTP Error Code:           403: Forbidden
Customize Error Response:  Yes
Response Page Path:        /index.html
HTTP Response Code:        200: OK
```

**Why handle 403:**
- S3 sometimes returns 403 instead of 404 for non-existent paths
- This ensures consistent behavior regardless of which error S3 returns

Click **Create Custom Error Response**

### Step 5: Wait for Deployment

- CloudFront will show "In Progress" status
- Deployment typically takes **5-15 minutes**
- You can monitor progress in the **General** tab under "Status"
- Wait until status shows "Deployed" before testing

---

## ✅ Verification

### Test Cases

After CloudFront deployment completes, verify these scenarios:

1. **Root Route:**
   - Visit: `https://best-shot-demo.mariobrusarosco.com/`
   - Expected: App loads → Redirects to `/dashboard` → Auth check → Redirects to `/login` if not authenticated

2. **Direct Route Access:**
   - Visit: `https://best-shot-demo.mariobrusarosco.com/dashboard`
   - Expected: App loads → Auth check → Shows dashboard or redirects to login

3. **Login Route:**
   - Visit: `https://best-shot-demo.mariobrusarosco.com/login`
   - Expected: Login page loads successfully

4. **Non-existent Route:**
   - Visit: `https://best-shot-demo.mariobrusarosco.com/non-existent-page`
   - Expected: App loads → TanStack Router shows 404 component (not CloudFront 404)

5. **Static Assets:**
   - Check browser DevTools Network tab
   - Expected: JS, CSS, and image files load with 200 status codes

### Verification Commands

```bash
# Test root route (should return 200, not 404)
curl -I https://best-shot-demo.mariobrusarosco.com/

# Test a non-existent route (should return 200 and serve index.html)
curl -I https://best-shot-demo.mariobrusarosco.com/some-random-path

# Both should return:
# HTTP/2 200
# content-type: text/html
```

---

## 🎓 Educational Deep Dive: Understanding SPA Routing

### Client-Side vs Server-Side Routing

**Client-Side Routing (What Your App Uses):**
- Routes are handled by JavaScript in the browser
- TanStack Router intercepts link clicks and updates the URL
- No server request is made when navigating between routes
- The browser's History API is used to change the URL without page reload

**Server-Side Routing (Traditional Approach):**
- Each route corresponds to a different file/endpoint on the server
- Clicking a link triggers a full page reload
- The server decides what HTML to send based on the URL

### The SPA Deployment Challenge

When you build a SPA:
1. All your routes are compiled into a single `index.html` + JavaScript bundles
2. The routing logic lives in the JavaScript, not on the server
3. The server only has static files: `index.html`, `assets/index-xyz.js`, etc.

**The Problem:**
- User visits `https://example.com/dashboard`
- Server looks for a file at `/dashboard`
- No such file exists (it's a client-side route)
- Server returns 404

**The Solution:**
- Configure the server to serve `index.html` for all non-file paths
- The JavaScript loads and reads the URL
- Client-side router renders the correct component

### How This Works in Different Environments

| Environment | How SPA Routing is Handled |
|-------------|----------------------------|
| **Vite Dev Server** | Built-in middleware serves `index.html` for all routes |
| **Netlify** | Automatic via `_redirects` file or `netlify.toml` |
| **Vercel** | Automatic detection of SPAs |
| **AWS S3 + CloudFront** | Manual configuration via Custom Error Responses |
| **Nginx** | `try_files $uri $uri/ /index.html;` directive |
| **Apache** | `.htaccess` with `FallbackResource /index.html` |

### Why Return 200 Instead of 404?

When CloudFront serves `index.html` for a non-existent path, we configure it to return **200 OK** instead of **404 Not Found**:

**Benefits:**
- **SEO:** Search engines see valid pages, not errors
- **User Experience:** No error messages during normal navigation
- **Analytics:** Proper tracking of page views
- **Browser Behavior:** No error console messages

**How 404s are Still Handled:**
- Your React app loads successfully (200 status)
- TanStack Router evaluates the route
- If the route doesn't exist in your app, it shows your custom 404 component
- This is a "soft 404" - handled by your app, not the server

---

## 🔄 Applying to All Environments

This fix needs to be applied to **each CloudFront distribution**:

### Environments to Update

1. **Demo Environment**
   - Domain: `best-shot-demo.mariobrusarosco.com`
   - Distribution ID: From `AWS_CLOUDFRONT_ID` secret (demo)

2. **Staging Environment**
   - Domain: `best-shot-staging.mariobrusarosco.com`
   - Distribution ID: From `AWS_CLOUDFRONT_ID` secret (staging)

3. **Production Environment**
   - Domain: `best-shot.mariobrusarosco.com`
   - Distribution ID: From `AWS_CLOUDFRONT_ID` secret (production)

### Important Notes

- Each environment may use a different CloudFront distribution
- Apply the same error response configuration to all distributions
- Test each environment independently after configuration

---

## 🚀 Future Automation (Optional)

### Infrastructure as Code

To prevent this issue in future deployments, consider:

**Option 1: AWS CloudFormation**
```yaml
# cloudformation-template.yaml
CustomErrorResponses:
  - ErrorCode: 404
    ResponseCode: 200
    ResponsePagePath: /index.html
  - ErrorCode: 403
    ResponseCode: 200
    ResponsePagePath: /index.html
```

**Option 2: Terraform**
```hcl
# main.tf
resource "aws_cloudfront_distribution" "main" {
  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }
  
  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }
}
```

**Option 3: AWS CLI Script**
```bash
#!/bin/bash
# update-cloudfront-error-pages.sh

DISTRIBUTION_ID="YOUR_DISTRIBUTION_ID"

# Get current config
aws cloudfront get-distribution-config \
  --id $DISTRIBUTION_ID \
  --output json > current-config.json

# Modify config to add custom error responses
# (requires jq or manual JSON editing)

# Update distribution
aws cloudfront update-distribution \
  --id $DISTRIBUTION_ID \
  --if-match $(jq -r '.ETag' current-config.json) \
  --distribution-config file://modified-config.json
```

---

## 📚 Related Documentation

### Internal Docs
- [CI/CD Deployment Guide](../guides/0007-ci-cd-deployment.md)
- [Build System Documentation](../build-system.md)

### External Resources
- [AWS CloudFront Custom Error Responses](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GeneratingCustomErrorResponses.html)
- [TanStack Router Documentation](https://tanstack.com/router/latest)
- [SPA Deployment Best Practices](https://create-react-app.dev/docs/deployment/)

---

## 🐛 Troubleshooting

### Issue: Changes Not Taking Effect

**Problem:** After configuring CloudFront, still seeing 404 errors

**Solutions:**
1. **Wait for deployment:** CloudFront changes can take 10-15 minutes
2. **Clear browser cache:** Hard refresh with `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
3. **Check CloudFront cache:** Create a cache invalidation for `/*`
4. **Verify configuration:** Ensure both 403 and 404 error responses are configured

### Issue: Static Assets Not Loading

**Problem:** App loads but CSS/JS files return 404

**Solutions:**
1. **Check build output:** Verify files exist in `dist/` folder
2. **Check S3 sync:** Ensure `aws s3 sync ./dist s3://${AWS_BUCKET_ID}` completed successfully
3. **Check file paths:** Verify asset paths in `index.html` match files in S3
4. **Check CloudFront origin:** Ensure origin is configured correctly

### Issue: Infinite Redirect Loop

**Problem:** App keeps redirecting between routes

**Solutions:**
1. **Check auth logic:** Verify authentication state is loading correctly
2. **Check route configuration:** Ensure no circular redirects in route definitions
3. **Check browser console:** Look for JavaScript errors preventing proper routing
4. **Check environment variables:** Verify API endpoints are correct for the environment

### Issue: Some Routes Work, Others Don't

**Problem:** `/login` works but `/dashboard` doesn't

**Solutions:**
1. **Check route definitions:** Ensure all routes are properly defined in `src/routes/`
2. **Check auth requirements:** Verify authentication logic in `_auth.tsx`
3. **Regenerate route tree:** Run `yarn dev` to regenerate `routeTree.gen.ts`
4. **Check build output:** Ensure production build includes all route files

---

## ✨ Success Criteria

After implementing this fix, you should have:

- ✅ Root route (`/`) loads the application successfully
- ✅ Direct navigation to any route works (e.g., `/dashboard`, `/tournaments`)
- ✅ Browser refresh on any route maintains the current page
- ✅ Authentication redirects work properly
- ✅ Static assets (JS, CSS, images) load correctly
- ✅ No 404 errors in browser console for valid routes
- ✅ Custom 404 page shows for invalid routes (handled by TanStack Router)

---

## 📝 Summary

**Problem:** CloudFront returns 404 for SPA routes because it looks for physical files  
**Solution:** Configure Custom Error Responses to serve `index.html` for 404/403 errors  
**Impact:** All routes work correctly, authentication flows properly, user experience improved  
**Effort:** 10-15 minutes configuration + 5-15 minutes deployment time  
**Complexity:** Low - one-time AWS Console configuration  

This is a standard configuration for any SPA deployed to CloudFront/S3 and should be part of the initial infrastructure setup for future projects.

