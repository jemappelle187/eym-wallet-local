# Construction Page Bypass System

This system allows you to show an "Under Construction" page to visitors while still being able to access the full website during development.

## How It Works

### For Visitors (Default Behavior)
- When someone visits your site, they see the `under-construction.html` page
- This page shows a professional "Coming Soon" message with your brand
- Includes newsletter signup and social links

### For You (Developer Access)
- **URL Parameter**: Add `?preview=2026` to any URL
  - Example: `https://yoursite.com?preview=2026`
  - Example: `https://yoursite.com/index.html?preview=2026`
- **Permanent Bypass**: Once you use the parameter, it remembers you (stored in localStorage)
- **Subtle Link**: There's a small "Developer Access" link in the bottom-right corner of the construction page

## Files Created

1. **`under-construction.html`** - The construction page visitors see
2. **`construction-bypass.js`** - The bypass logic system
3. **`CONSTRUCTION_BYPASS_README.md`** - This documentation

## How to Use

### To Access the Full Site:
1. **Temporary Access**: Visit `https://yoursite.com?preview=2026`
2. **Permanent Access**: After using the parameter once, you'll have permanent access
3. **Subtle Link**: Click "Developer Access" in the bottom-right corner of the construction page

### To Reset (Show Construction Page Again):
1. Open browser console (F12)
2. Type: `clearBypass()`
3. Refresh the page

### To Disable the System:
1. Remove the `<script src="construction-bypass.js"></script>` lines from both HTML files
2. Or rename `construction-bypass.js` to something else

## Customization

### Change the Secret Parameter:
Edit `construction-bypass.js` and modify:
```javascript
BYPASS_PARAM: 'preview',  // Change 'preview' to anything
BYPASS_VALUE: '2026',     // Change '2026' to anything
```

### Change the Construction Page:
1. Edit `under-construction.html` to match your brand
2. Update colors, text, and styling as needed

### Change the Bypass Link Text:
Edit the `addBypassLink()` function in `construction-bypass.js`:
```javascript
bypassLink.textContent = 'Developer Access'; // Change this text
```

## Deployment

### For GitHub Pages:
- All files will work as-is
- The bypass system works on any hosting platform

### For Vercel/Netlify:
- No additional configuration needed
- The system works with any static hosting

## Security Notes

- This is a **client-side bypass** - not secure for sensitive content
- The secret parameter is visible in the URL
- Anyone who knows the parameter can bypass
- Suitable for development/preview purposes

## Testing

1. **Test Construction Page**: Visit your site normally
2. **Test Bypass**: Add `?preview=2026` to the URL
3. **Test Reset**: Use `clearBypass()` in console
4. **Test Permanent Access**: Use bypass once, then visit normally

## Troubleshooting

### Construction Page Not Showing:
- Check that `construction-bypass.js` is loaded
- Clear localStorage: `localStorage.clear()`
- Check browser console for errors

### Bypass Not Working:
- Verify the URL parameter is correct: `?preview=2026`
- Check that the script is loading properly
- Try clearing localStorage and using the parameter again

### Page Redirects in Loop:
- Clear localStorage: `localStorage.clear()`
- Check file paths in the script
- Verify both HTML files exist
