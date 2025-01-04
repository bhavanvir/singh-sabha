# singh-sabha

singh-sabha is the code repository for **singhsabha.net**, the official website for **Gurdwara Singh Sabha** in Victoria, B.C. The website offers booking services for events, a calendar view for upcoming events, and an admin dashboard to manage bookings and payments.

## Features

- **Event Booking System**: Users can book services at the Gurdwara, such as hall rentals, ceremonies, and other events.
- **Calendar View**: A calendar that displays all upcoming events, making it easy for users to check availability and plan.
- **Admin Dashboard**: Admins can manage event bookings, view upcoming events, and track payments.
- **Stripe Integration**: Payments for bookings are handled through Stripe for secure online transactions.
- **Email Notifications**: Automated email notifications are sent via Resend, including booking confirmations and reminders.
- **Responsive Design**: The website is mobile-friendly and accessible across all devices.
- **Backend with Supabase**: The backend is powered by Supabase, providing a reliable database and real-time functionality.
- **Frontend with Next.js**: Built using Next.js, ensuring fast, dynamic pages with server-side rendering.
- **UI Components**: shadcn/ui components and TailwindCSS for responsive, accessible, and modern UI design.

## Technologies Used

- **Frontend**:

  - [Next.js](https://nextjs.org/) for React-based frontend.
  - [TypeScript](https://www.typescriptlang.org/) for static typing.
  - [TailwindCSS](https://tailwindcss.com/) for utility-first CSS styling.
  - [shadcn/ui](https://github.com/shadcn/ui) for UI components.

- **Backend**:

  - [Supabase](https://supabase.io/) for database and authentication.
  - [Drizzle ORM](https://drizzle.team/) for database management.

- **Payments**:

  - [Stripe](https://stripe.com/) for handling payments via checkout links.

- **Email Service**:
  - [Resend](https://resend.com/) for sending transactional emails.

## Setup and Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/bhavanvir/singh-sabha.git
   cd singh-sabha
   ```

2. **Install dependencies**:

   Install the required dependencies using npm or yarn:

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**:

   Create a `.env.local` file in the root directory and configure the necessary environment variables:

   ```env
   DATABASE_URL=
   NEXT_PUBLIC_SECRET_KEY= # Can use `openssl rand -hex 32` to generate a random key
   RESEND_API_KEY=
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
   STRIPE_SECRET_KEY=
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

4. **Run the development server**:

   Start the Next.js development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The app will be running on [http://localhost:3000](http://localhost:3000).

## Deployment

To deploy the application, we recommend using [Vercel](https://vercel.com/) for easy deployment of Next.js applications.

1. Push your code to a Git repository.
2. Link your repository to Vercel and follow the instructions for deployment.
3. Ensure that the necessary environment variables are set in the Vercel dashboard.

## Contributing

We welcome contributions! If you would like to contribute to this project, please fork the repository, create a new branch, and submit a pull request with your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- **Next.js**: For building the fast and efficient React framework.
- **Stripe**: For secure payment handling.
- **Supabase**: For providing an open-source alternative to Firebase.
- **Resend**: For email notifications.

## Contact

For inquiries or feedback, please contact us at [singhsabhayyj@gmail.com](mailto:singhsabhayyj@gmail.com).

