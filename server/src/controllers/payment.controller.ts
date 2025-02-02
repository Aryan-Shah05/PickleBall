import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const paymentController = {
  createPaymentIntent: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookingId } = req.body;

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { court: true },
      });

      if (!booking) {
        throw new AppError(404, 'Booking not found', 'BOOKING_NOT_FOUND');
      }

      // Calculate amount in cents
      const amount = Math.round(booking.totalAmount * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        metadata: { bookingId },
      });

      res.status(200).json({
        status: 'success',
        data: {
          clientSecret: paymentIntent.client_secret,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  processPayment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { bookingId, paymentIntentId } = req.body;

      if (!req.user?.id) {
        throw new AppError(401, 'User not authenticated', 'UNAUTHORIZED');
      }

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) {
        throw new AppError(404, 'Booking not found', 'BOOKING_NOT_FOUND');
      }

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          bookingId,
          userId: req.user.id,
          amount: booking.totalAmount,
          status: 'COMPLETED',
          paymentMethod: 'stripe',
          transactionId: paymentIntentId,
        },
      });

      // Update booking status
      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus: 'COMPLETED',
        },
      });

      res.json({
        status: 'success',
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  },

  getPaymentById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!req.user?.id) {
        throw new AppError(401, 'User not authenticated', 'UNAUTHORIZED');
      }

      const payment = await prisma.payment.findUnique({
        where: { id },
        include: {
          booking: {
            include: {
              court: true,
            },
          },
        },
      });

      if (!payment) {
        throw new AppError(404, 'Payment not found', 'PAYMENT_NOT_FOUND');
      }

      // Check if user is authorized to view this payment
      if (req.user.role !== 'ADMIN' && payment.userId !== req.user.id) {
        throw new AppError(403, 'Not authorized to view this payment', 'FORBIDDEN');
      }

      res.json({
        status: 'success',
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  },

  getMyPayments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.id) {
        throw new AppError(401, 'User not authenticated', 'UNAUTHORIZED');
      }

      const payments = await prisma.payment.findMany({
        where: {
          userId: req.user.id,
        },
        include: {
          booking: {
            include: {
              court: true,
            },
          },
        },
      });

      res.json({
        status: 'success',
        data: payments,
      });
    } catch (error) {
      next(error);
    }
  },

  handleWebhook: async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      if (!sig || !webhookSecret) {
        throw new Error('Missing Stripe webhook signature or secret');
      }

      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        webhookSecret
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          const bookingId = paymentIntent.metadata.bookingId;

          if (!req.user?.id) {
            throw new AppError(401, 'User not authenticated', 'UNAUTHORIZED');
          }

          await prisma.payment.create({
            data: {
              bookingId,
              userId: req.user.id,
              amount: paymentIntent.amount / 100,
              status: 'COMPLETED',
              paymentMethod: 'STRIPE',
              transactionId: paymentIntent.id
            }
          });

          await prisma.booking.update({
            where: { id: bookingId },
            data: { paymentStatus: 'COMPLETED' }
          });
          break;
      }

      res.json({ received: true });
    } catch (err) {
      const error = err as Error;
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
}; 