const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = `${process.env.EMAIL_SENDER_NAME}<${process.env.EMAIL_FROM}>`;
  }

  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      const transporter = nodemailer.createTransport({
        host: process.env.REAL_EMAIL_HOST,
        port: process.env.REAL_EMAIL_PORT,
        auth: {
          user: process.env.REAL_EMAIL_USERNAME,
          pass: process.env.REAL_EMAIL_PASSWORD,
        },
      });
      return transporter;
    }
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    return transporter;
  }

  async send(text, subject) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      text: text,
    };
    const transporter = this.createTransport();
    await transporter.sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('Welcome!!!', 'Welcome to the family');
  }

  async sendPasswordReset(text, subject) {
    await this.send(text, subject);
  }
};
