# Stay Kerala Project V1

A property booking platform for Kerala tourism built with React frontend and Node.js backend.

## Project Overview

This platform enables customers to browse and book properties in Kerala, with two main login systems for Partners and Admins. Customers only need to register/login when they proceed to book a property.

## Login Systems

### 1. Partner Login
- Property owners can register their properties
- Manage bookings and property details
- View analytics and earnings
- Update property images and information

### 2. Admin Login
- Manage all properties and partners
- Oversee customer bookings
- System configuration and monitoring
- Generate reports and analytics

### Customer Registration/Login
- Customers browse properties without login
- Registration/login required only at booking time
- Simplified checkout process
- Booking history for returning customers

## Folder Structure

```
stay-kerala-project-v1/
├── frontend/                  # React frontend application
│   ├── public/
│   │   └── images/           # Image placeholders
│   │       ├── properties/   # Property images
│   │       ├── heroes/       # Hero/banner images
│   │       └── logos/        # Logo and branding
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/
│   │   │   ├── customer/     # Customer dashboard pages
│   │   │   ├── partner/      # Partner dashboard pages
│   │   │   └── admin/        # Admin dashboard pages
│   │   ├── services/         # API service calls
│   │   ├── utils/            # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
├── backend/                   # Node.js backend application
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Authentication, validation
│   │   ├── config/           # Configuration files
│   │   └── server.js         # Entry point
│   ├── package.json
│   └── README.md
│
├── docs/                      # Documentation
└── README.md                  # This file
```

## AWS EC2 Setup Instructions

### Prerequisites
- AWS Account with EC2 access
- Domain name (optional)
- SSH key pair for EC2 access

### Step 1: Launch EC2 Instance

1. Log in to AWS Console and navigate to EC2
2. Click "Launch Instance"
3. Choose an Amazon Linux 2 or Ubuntu Server AMI
4. Select instance type (t2.micro for free tier, t2.medium or larger for production)
5. Configure instance details:
   - Enable auto-assign public IP
   - Configure security group:
     - SSH (port 22) from your IP
     - HTTP (port 80) from anywhere
     - HTTPS (port 443) from anywhere
     - Custom TCP (port 3000) for React dev server
     - Custom TCP (port 5000) for Node.js backend
6. Add storage (at least 20GB recommended)
7. Add tags (Name: stay-kerala-server)
8. Select or create a key pair and launch

### Step 2: Connect to EC2 Instance

```bash
# SSH into your instance
ssh -i "your-key.pem" ec2-user@your-instance-public-ip

# For Ubuntu:
ssh -i "your-key.pem" ubuntu@your-instance-public-ip
```

### Step 3: Install Node.js and Dependencies

```bash
# Update system packages
sudo yum update -y  # For Amazon Linux
# OR
sudo apt update && sudo apt upgrade -y  # For Ubuntu

# Install Node.js (using NVM)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
node --version

# Install Git
sudo yum install git -y  # For Amazon Linux
# OR
sudo apt install git -y  # For Ubuntu

# Install PM2 for process management
npm install -g pm2
```

### Step 4: Clone and Setup Project

```bash
# Clone repository
git clone https://github.com/sabhinand5-cpu/stay-kerala-project-v1.git
cd stay-kerala-project-v1

# Setup backend
cd backend
npm install
# Create .env file with your configuration
cp .env.example .env
nano .env  # Edit with your database and JWT secrets

# Setup frontend
cd ../frontend
npm install
# Create .env file
cp .env.example .env
nano .env  # Edit with API endpoint
```

### Step 5: Configure Environment Variables

**Backend .env:**
```
PORT=5000
NODE_ENV=production
JWT_SECRET=your-secret-key-here
DB_CONNECTION_STRING=your-database-url
FRONTEND_URL=http://your-domain.com
```

**Frontend .env:**
```
REACT_APP_API_URL=http://your-instance-ip:5000/api
```

### Step 6: Build and Start Applications

```bash
# Start backend with PM2
cd backend
pm2 start src/server.js --name stay-kerala-backend

# Build and serve frontend
cd ../frontend
npm run build

# Option 1: Serve with serve package
npm install -g serve
pm2 start "serve -s build -l 3000" --name stay-kerala-frontend

# Option 2: Use Nginx (recommended for production)
sudo yum install nginx -y  # Amazon Linux
# OR
sudo apt install nginx -y  # Ubuntu
```

### Step 7: Configure Nginx (Production)

```bash
# Create Nginx config
sudo nano /etc/nginx/conf.d/stay-kerala.conf
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend
    location / {
        root /home/ec2-user/stay-kerala-project-v1/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Test and restart Nginx
sudo nginx -t
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 8: Setup SSL with Let's Encrypt (Optional)

```bash
# Install Certbot
sudo yum install certbot python3-certbot-nginx -y  # Amazon Linux
# OR
sudo apt install certbot python3-certbot-nginx -y  # Ubuntu

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Step 9: PM2 Startup Configuration

```bash
# Save PM2 process list
pm2 save

# Generate startup script
pm2 startup
# Follow the command it provides

# Check status
pm2 status
pm2 logs
```

## Database Selection Guide

The application is designed to be database-agnostic. Choose based on your needs:

### Option 1: MongoDB (Recommended for MVP)
**Pros:**
- Quick setup and flexible schema
- Good for rapid development
- Easy to modify data structure
- MongoDB Atlas offers free tier

**Best for:** Early development, changing requirements

**Setup:**
```bash
npm install mongoose
```

### Option 2: PostgreSQL
**Pros:**
- ACID compliance
- Strong data integrity
- Complex queries and relationships
- AWS RDS offers managed service

**Best for:** Production with complex data relationships

**Setup:**
```bash
npm install pg sequelize
```

### Option 3: MySQL
**Pros:**
- Widely supported
- Good performance
- AWS RDS compatibility
- Familiar to most developers

**Best for:** Traditional relational data

**Setup:**
```bash
npm install mysql2 sequelize
```

### Recommendation
Start with **MongoDB** for faster development, then migrate to PostgreSQL if you need stronger data consistency for production.

## Development Workflow

### Local Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### Deployment Updates

```bash
# SSH into EC2
ssh -i "your-key.pem" ec2-user@your-instance-ip

cd stay-kerala-project-v1
git pull origin main

# Update backend
cd backend
npm install
pm2 restart stay-kerala-backend

# Update frontend
cd ../frontend
npm install
npm run build
pm2 restart stay-kerala-frontend
```

## Dashboard Pages Structure

### Customer Dashboard (`/customer/dashboard`)
- My Bookings
- Booking History
- Profile Settings
- Favorites/Wishlist

### Partner Dashboard (`/partner/dashboard`)
- My Properties
- Add New Property
- Bookings Management
- Revenue Analytics
- Property Images Management

### Admin Dashboard (`/admin/dashboard`)
- All Properties Overview
- All Bookings
- Partner Management
- Customer Management
- System Analytics
- Reports Generation

## Security Considerations

1. **Environment Variables**: Never commit .env files
2. **JWT Tokens**: Use strong secrets and appropriate expiration
3. **Password Hashing**: Use bcrypt with sufficient salt rounds
4. **Input Validation**: Validate all user inputs
5. **CORS**: Configure properly for production
6. **Rate Limiting**: Implement to prevent abuse
7. **HTTPS**: Always use SSL in production

## Monitoring and Maintenance

```bash
# Check application logs
pm2 logs stay-kerala-backend
pm2 logs stay-kerala-frontend

# Monitor resources
pm2 monit

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Future Enhancements

- Payment gateway integration
- Email notifications
- SMS notifications
- Advanced search and filters
- Rating and review system
- Multi-language support
- Mobile application

## Support

For issues and questions, please create an issue in this repository.

## License

MIT License
