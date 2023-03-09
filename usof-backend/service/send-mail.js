import nodemailer from 'nodemailer';

class SendMail {
  constructor(userEmail) {
    this.from = ''; // your email
    this.password = ''; // your password
  }
  send(to, token, type) {
    const massageEmail = {};
    if (type === 'activate') {
      massageEmail.subject = 'Activate email Link - usof-backend.com';
      massageEmail.html = `
       <div>
            <p>
                Thank you for registering, for confirmation  email follow the
                    <a href="http://127.0.0.1:5173/confirm-email/${token}">
                    link
                    </a>
            </p>
        </div>
        `;
    } else {
      massageEmail.subject = 'Reset password link - usof-backend.com';
      massageEmail.html = `
        <div>
            <p>
                You requested for reset password, kindly use this to reset your password
                <a href="http://127.0.0.1:5173/reset-password/${token}">link</a>
            </p>
        </div>
        `;
    }
    const mail = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: this.from,
        pass: this.password,
      },
    });
    const mailOptions = {
      from: this.from,
      to,
      subject: massageEmail.subject,
      text: '',
      html: massageEmail.html,
    };
    return mail.sendMail(mailOptions);
  }
}

export default SendMail;
