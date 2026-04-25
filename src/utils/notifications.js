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
 */
export const sendDiscordNotification = async (paymentData, config) => {
  const url = config?.notifications?.discordWebhook || import.meta.env?.VITE_DISCORD_WEBHOOK_URL || '';

  if (!url) return;

  const payload = {
    content: "🔔 **New Payment Verification Required!**",
    embeds: [
      {
        title: `Payment Received: LKR ${paymentData.amount}`,
        color: 3447003,
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
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Discord notification failed:', error);
  }
};

/**
 * Sends a notification to Telegram using a Bot Token.
 */
export const sendTelegramNotification = async (paymentData, config) => {
  const token = config?.notifications?.telegramBotToken;
  const chatId = config?.notifications?.telegramChatId;

  if (!token || !chatId) return;

  const text = `🔔 *New Payment Received*\n\n` +
               `*Amount:* LKR ${paymentData.amount}\n` +
               `*Package:* ${paymentData.packageName}\n` +
               `*Method:* ${paymentData.method.toUpperCase()}\n` +
               `*Reference:* \`${paymentData.reference}\`\n` +
               `*User:* ${paymentData.userEmail}`;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown'
      }),
    });
  } catch (error) {
    console.error('Telegram notification failed:', error);
  }
};

/**
 * Sends an email notification.
 */
export const sendEmailNotification = async (paymentData) => {
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
  } catch (error) {
    console.error('Email notification failed:', error);
  }
};

/**
 * Wrapper function to trigger all notifications for a new payment.
 */
export const sendPaymentNotification = async (paymentData, config) => {
  await Promise.allSettled([
    sendDiscordNotification(paymentData, config),
    sendTelegramNotification(paymentData, config),
    sendEmailNotification(paymentData)
  ]);
};
