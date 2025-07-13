import nodemailer from 'nodemailer';

export const sendResetEmail = async (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,        // your Gmail
      pass: process.env.EMAIL_PASS    // app password from Gmail
    }
  });

  const mailOptions = {
    from: '"PomoMode Support" <yourmail@gmail.com>',
    to: email,
    subject: 'Reset your Pomomode password',
    html: `<p>Click the link below to reset your password:</p>
           <a href="${resetLink}">${resetLink}</a>
           <p>This link expires in 15 minutes.</p>`
  };

  await transporter.sendMail(mailOptions);
};
