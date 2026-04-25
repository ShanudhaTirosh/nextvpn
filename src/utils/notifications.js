import emailjs from '@emailjs/browser';

// -------------------------------------------------------------------
// NOTIFICATIONS UTILITY
// -------------------------------------------------------------------
// 
// IMPORTANT: To fully enable notifications, please update the 
// placeholders below with your actual API keys or Webhook URLs.
// -------------------------------------------------------------------

/**
 * Sends a notification to Discord using a Webhook URL.
 * You can create a webhook in your Discord Server Settings -> Integrations -> Webhooks.
 */
export const sendDiscordNotification = async (paymentData) => {
  // TODO: Replace this with your actual Discord Webhook URL
  const DISCORD_WEBHOOK_URL = import.meta.env?.VITE_DISCORD_WEBHOOK_URL || process.env.REACT_APP_DISCORD_WEBHOOK_URL || '';

  if (!DISCORD_WEBHOOK_URL) {
    console.warn('Discord Notification skipped: No webhook URL configured.');
    return;
  }

  const payload = {
    content: "🔔 **New Payment Verification Required!**",
    embeds: [
      {
        title: `Payment Received: LKR ${paymentData.amount}`,
        color: 3447003, // Blue color
        fields: [
          { name: "User Email", value: paymentData.userEmail || "Unknown", inline: true },
          { name: "Reference", value: paymentData.reference || "N/A", inline: true },
          { name: "Method", value: paymentData.method || "N/A", inline: true },
          { name: "Package", value: paymentData.packageName || "N/A", inline: true }
        ],
        timestamp: new Date().toISOString(),
      }
    ]
  };

  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log('Discord notification sent successfully.');
  } catch (error) {
    console.error('Failed to send Discord notification:', error);
  }
};

/**
 * Sends an email notification.
 * Since this is a React app without a backend, you'll need a service like EmailJS.
 * Sign up at https://www.emailjs.com/
 */
export const sendEmailNotification = async (paymentData) => {
  // TODO: Implement EmailJS or your preferred email service here.
  // Example with EmailJS:

  const serviceID = 'service_jham5y8';
  const templateID = 'jSr55vTsZQYjoXCPi';
  const publicKey = 'jSr55vTsZQYjoXCPi';
  
  try {
    await emailjs.send(serviceID, templateID, {
      user_email: paymentData.userEmail,
      amount: paymentData.amount,
      reference: paymentData.reference,
      method: paymentData.method,
      package: paymentData.packageName
    }, publicKey);
    console.log('Email notification sent successfully.');
  } catch (error) {
    console.error('Failed to send Email notification:', error);
    console.warn('Email Notification failed: Check your EmailJS configuration.');
  }
};

/**
 * Wrapper function to trigger all notifications for a new payment.
 */
export const sendPaymentNotification = async (paymentData) => {
  // Run notifications in parallel
  await Promise.allSettled([
    sendDiscordNotification(paymentData),
    sendEmailNotification(paymentData)
  ]);
};
