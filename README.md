# Equipora – Equipment Rental Platform (Frontend)

Equipora is a modern, user-friendly equipment rental platform that makes it easy for customers to discover and rent equipment online. It also provides equipment owners with tools to manage their listings, monitor rental activities, and track business performance.

The platform includes dedicated dashboards for customers, equipment owners, and administrators, providing a seamless rental experience with secure authentication and Stripe-powered payments.

## 🌐 Live Demo

🔗 [Frontend Live Site](https://equipment-rental-client-ecru.vercel.app)
🔗 [Backend Live Site](https://equipment-rental-server-ebon.vercel.app)

## 📂 Github Repository

🔗[Frontend Github Repository](https://github.com/nuruddin538/equipment-rental-client)
🔗[Backend Github Repository](https://github.com/nuruddin538/equipment-rental-server)

<!-- Add your project screenshot here -->

## ![DevStack Preview](https://i.ibb.co.com/21N55kj7/equipment-rental.png)

## 📌 Project Overview

Equipora is designed to simplify the equipment rental process by connecting equipment owners with customers who need equipment for a specific period.

Customers can browse available equipment, view detailed information, book equipment, and make secure online payments. Equipment owners can list their equipment, manage bookings, and monitor rental earnings. Administrators can manage users, equipment listings, and platform activities.

## ✨ Key Features

### 👤 Authentication & Authorization

- User registration and login.
- Secure authentication using Better Auth.
- JWT-based API authentication.
- Role-based access control.
- Protected dashboard routes.
- Customer, Owner, and Admin roles.

### 🛒 Equipment Management

- Browse available equipment.
- View detailed equipment information.
- Search and explore equipment listings.
- View equipment images, descriptions, prices, and availability.
- Add equipment to favorites.
- Display equipment condition, category, brand, and model.

### 📅 Booking & Rental Management

- Book equipment for a selected rental period.
- Select rental dates and quantities.
- Calculate rental costs based on price, duration, and quantity.
- View booking details and rental status.
- Track payment and booking information.

### 💳 Payment Integration

- Secure Stripe Checkout integration.
- Process payments in USD.
- Display payment status.
- Handle successful and unsuccessful checkout flows.
- Show booking and payment information.

### 📊 Customer Dashboard

- View personal profile information.
- Manage bookings.
- Track rental history.
- View favorite equipment.
- Monitor booking and payment status.

### 🏢 Owner Dashboard

- Add new equipment listings.
- Manage existing equipment.
- Update equipment information.
- Monitor rental requests.
- Track customer rental activities.
- View total equipment and rental statistics.
- Analyze completed rentals and total earnings.
- Visualize monthly earnings using Recharts.

### 🛡️ Admin Dashboard

- Monitor platform statistics.
- Manage registered users.
- Manage equipment listings.
- Review pending equipment approvals.
- Monitor booking activities.
- Track completed rentals and platform revenue.
- Visualize monthly booking statistics using Recharts.

### 📱 Responsive Design

- Mobile-friendly interface.
- Tablet and desktop support.
- Modern dashboard layouts.
- Reusable UI components.
- Interactive notifications and loading states.

## 🧰 Technologies Used

| Technology   | Purpose                                 |
| ------------ | --------------------------------------- |
| Next.js      | React framework and application routing |
| React        | User interface development              |
| TypeScript   | Type safety                             |
| Tailwind CSS | Styling and responsive design           |
| Better Auth  | Authentication                          |
| Stripe       | Online payment integration              |
| Recharts     | Analytics and data visualization        |
| Lucide React | Icons                                   |
| Sonner       | Toast notifications                     |

## 📂 Project Structure

```text
equipment-rental-client/
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (customer)/
│   │   ├── (owner)/
│   │   ├── (admin)/
│   │   └── api/
│   │
│   ├── components/
│   │   ├── admin/
│   │   ├── owner/
│   │   ├── customer/
│   │   └── shared/
│   │
│   ├── lib/
│   │   ├── api/
│   │   ├── types/
│   │   └── auth-client.ts
│   │
│   └── middleware.ts
│
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

_Note: The directory structure may vary depending on the latest implementation._

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <YOUR_FRONTEND_REPOSITORY_URL>
```

### 2. Navigate to the Project

```bash
cd equipment-rental-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000

BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Add other Better Auth and OAuth environment variables required by your configuration.

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

| Command            | Description                  |
| ------------------ | ---------------------------- |
| `npm run dev`      | Start development server     |
| `npm run build`    | Build production application |
| `npm run start`    | Start production server      |
| `npm run lint`     | Run ESLint                   |
| `npx tsc --noEmit` | Check TypeScript errors      |

## 🔗 Backend API Integration

The frontend communicates with the Equipora backend through REST API endpoints.

The API handles:

- Authentication verification.
- Equipment management.
- Booking operations.
- Payment processing.
- User and owner dashboard data.
- Admin analytics.
- Rental statistics.

The frontend sends authenticated requests using JWT Bearer tokens.

## 💳 Payment Flow

1. Customer selects equipment.
2. Customer chooses rental dates and quantity.
3. Frontend sends booking information to the backend.
4. Backend validates the booking and calculates the total amount.
5. Backend creates a Stripe Checkout session.
6. Customer completes payment through Stripe.
7. Customer returns to the application.
8. The application displays the payment and booking status.

## 🔐 Security

- Protected application routes.
- JWT-based API communication.
- Role-based dashboard access.
- Environment variables for sensitive configuration.
- Server-side validation through the backend API.
- Secure Stripe Checkout integration.

## 🚀 Deployment

The frontend can be deployed using Vercel.

Before deployment:

1. Configure the production API URL.
2. Set the required authentication environment variables.
3. Configure OAuth callback URLs.
4. Configure the production backend URL.
5. Deploy the application.

## 👨‍💻 Developer

**MD. NUR UDDIN**

Next.js Full Stack Web Developer

- GitHub: [nuruddin538](https://github.com/nuruddin538)

## 📄 License

This project is developed for educational and portfolio purposes.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
