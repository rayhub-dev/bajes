#!/bin/bash
# ─── VPS Initial Setup Script ─────────────────────────────────────────────────
# Run this ONCE on a fresh VPS to prepare for Bajes API deployment
#
# Prerequisites:
#   - Ubuntu 22.04+ / Debian 12+
#   - Root or sudo access
#   - SSH access configured
#
# Usage:
#   chmod +x vps-setup.sh
#   sudo ./vps-setup.sh
#
# After running this script:
#   1. Add GitHub Actions secrets (VPS_HOST, VPS_USER, VPS_SSH_KEY, VPS_PORT)
#   2. Create .env file at /home/deploy/bajes-production/.env
#   3. Push to develop/main branch to trigger deployment

set -euo pipefail

echo "═══════════════════════════════════════════════════════════"
echo "  Bajes VPS Setup Script"
echo "═══════════════════════════════════════════════════════════"

# ─── 1. System Update ────────────────────────────────────────────────────────
echo ""
echo "▶ Updating system packages..."
apt update && apt upgrade -y

# ─── 2. Install Node.js 20 LTS ──────────────────────────────────────────────
echo ""
echo "▶ Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo "  Node.js version: $(node --version)"
echo "  npm version: $(npm --version)"

# ─── 3. Install PM2 ─────────────────────────────────────────────────────────
echo ""
echo "▶ Installing PM2..."
npm install -g pm2

# Setup PM2 to start on boot
pm2 startup systemd -u deploy --hp /home/deploy
echo "  PM2 version: $(pm2 --version)"

# ─── 4. Install Nginx ────────────────────────────────────────────────────────
echo ""
echo "▶ Installing Nginx..."
apt install -y nginx

# Enable and start Nginx
systemctl enable nginx
systemctl start nginx
echo "  Nginx version: $(nginx -v 2>&1)"

# ─── 5. Create deploy user ──────────────────────────────────────────────────
echo ""
echo "▶ Creating deploy user..."
if ! id "deploy" &>/dev/null; then
    useradd -m -s /bin/bash deploy
    echo "  User 'deploy' created"
else
    echo "  User 'deploy' already exists"
fi

# Create deployment directories
mkdir -p /home/deploy/bajes-staging
mkdir -p /home/deploy/bajes-production
mkdir -p /home/deploy/bajes-staging/logs
mkdir -p /home/deploy/bajes-production/logs
chown -R deploy:deploy /home/deploy/

# ─── 6. Setup SSH for deploy user ───────────────────────────────────────────
echo ""
echo "▶ Setting up SSH for deploy user..."
mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
touch /home/deploy/.ssh/authorized_keys
chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh

echo ""
echo "  ⚠️  Add your GitHub Actions SSH public key to:"
echo "     /home/deploy/.ssh/authorized_keys"

# ─── 7. Firewall (UFW) ──────────────────────────────────────────────────────
echo ""
echo "▶ Configuring firewall..."
apt install -y ufw
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable
echo "  Firewall configured (SSH + Nginx allowed)"

# ─── 8. Install Nginx config ────────────────────────────────────────────────
echo ""
echo "▶ Nginx config note:"
echo "  Copy deploy/nginx/bajes-api.conf to /etc/nginx/sites-available/"
echo "  Then: sudo ln -s /etc/nginx/sites-available/bajes-api /etc/nginx/sites-enabled/"
echo "  Then: sudo nginx -t && sudo systemctl reload nginx"

# ─── 9. Summary ─────────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  ✅ VPS Setup Complete!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "  Next steps:"
echo "  1. Add SSH public key to /home/deploy/.ssh/authorized_keys"
echo "  2. Copy nginx config:"
echo "     sudo cp deploy/nginx/bajes-api.conf /etc/nginx/sites-available/bajes-api"
echo "     sudo ln -s /etc/nginx/sites-available/bajes-api /etc/nginx/sites-enabled/"
echo "     sudo nginx -t && sudo systemctl reload nginx"
echo "  3. Create .env files:"
echo "     /home/deploy/bajes-staging/.env"
echo "     /home/deploy/bajes-production/.env"
echo "  4. Add GitHub repo secrets:"
echo "     VPS_HOST     = your VPS IP address"
echo "     VPS_USER     = deploy"
echo "     VPS_SSH_KEY  = private key content"
echo "     VPS_PORT     = 22 (or custom)"
echo "     API_URL      = http://YOUR_VPS_IP (for health check)"
echo "  5. Create 'develop' branch and push to trigger staging deploy"
echo ""
