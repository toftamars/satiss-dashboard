# Deployment Guide

## Production Checklist
- [ ] Environment variables configured
- [ ] Sentry DSN added
- [ ] HTTPS enabled
- [ ] Tests passing
- [ ] Security headers configured

## Deploy to GitHub Pages
```bash
git push origin main
```

## Deploy to Custom Server
```bash
npm run build
scp -r dist/ user@server:/var/www/html/
```
