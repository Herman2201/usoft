import nodemailer from 'nodemailer';

class SendMail {
  constructor(userEmail) {
    this.from = 'gladyce68@ethereal.email';
    this.password = 'v87d4eaDrZhSH3Fth6';
  }
  send(to, token, type) {
    const massageEmail = {};
    if (type === 'activate') {
      massageEmail.subject = 'Activate email Link - usof-backend.com';
      massageEmail.html = `
       <div>
            <p>
                Thank you for registering, for confirmation  email follow the
                    <a href="http://localhost:8080/api/auth/active/${token}">
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
                <a link href="http://localhost:8080/api/auth/password-reset/${token}">link</a>
            </p>
        </div>
        `;
    }
    const mail = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
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
    mail.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('send massage');
      }
    });
  }
}

export default SendMail;
