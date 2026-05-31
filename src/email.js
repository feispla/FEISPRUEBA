const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function sendContactEmail({ name, email, message }) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Nuevo mensaje de contacto de ${name}`,
    text: `De: ${name} <${email}>\n\n${message}`,
    html: `<p><strong>De:</strong> ${name} &lt;${email}&gt;</p><p>${message}</p>`
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendContactEmail };
