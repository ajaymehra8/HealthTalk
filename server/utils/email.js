const nodemailer = require("nodemailer");
const { convert } = require("html-to-text");

module.exports = class Email {
  constructor(user) {
    this.to = user.email;
    if (user.name) {
      this.firstName = user.name.split(" ")[0];
    }
    this.from = process.env.Email_Username;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.Email_Username,
        pass: process.env.Email_Password,
      },
      logger: true, 
      debug: true,
    });
  }

  async send(subject, message, email = this.to) {
    // 1) Define the email options
    console.log(email);
    const mailOptions = {
      from: this.from,
      to: email,
      subject,
      html: message, // HTML message content
      text: convert(message, { wordwrap: 130 }), // Plain-text version of the email
    };

    // 2) Create a transport and send the email
    try {
      console.log("message in process");
       const main=async()=>{
      await this.newTransport().sendMail(mailOptions);
      console.log("message is sended");}
      await main().catch(console.error)

    } catch (err) {
      console.error("Error sending email:", err);
      throw new Error("Failed to send email.");
    }
  }

  async sendWelcome() {
    const message = `
      <h1>Welcome to the HealthTalk Website.</h1>
      <p>Hi ${this.firstName},</p>
      <p>Thank you for joining us! We're excited to have you.</p>
    `;
    await this.send("Welcome to the HealthTalk Family", message);
  }

  async sendPasswordReset() {
    const message = `
      <h1>Password Reset Request</h1>
      <p>Hi ${this.firstName},</p>
      <p>We received a request to reset your password. Click the link below to reset it:</p>
      <p>This link is valid for 10 minutes.</p>
    `;
    await this.send(
      "Your Password Reset Token (Valid for 10 minutes)",
      message
    );
  }
  async sendOtp(otp) {
    const message = `
    <h4>Your otp for email verification is <b>${otp}</b></h4>
  `;
    await this.send(
      "Your OTP for email verification. (Valid for 5 minutes)",
      message
    );
  }
  async report(doctor, user) {
    console.log(user.email,doctor?.email);
    const messageForAdmin = `
    <h4>Doctor  Dr. <b>${doctor?.name}</b> is reported by the <b>${user.name}</b></h4>
  `;
    const messageForUser = `
  <h4>Your report for  Dr. <b>${doctor?.name}</b> is successfully submited, We take action as soon as possible.  </b></h4>
`;
    const messageForDoctor = `
<h4>You are reported by the user <b>${user.name}</b></h4>
`;
    await this.send(
      "Your recent report submission in HealthTalk",
      messageForUser,
      user?.email
    );
    await this.send(
      `Doctor Dr. ${doctor?.name} is reported by ${user?.name} in HealthTalk`,
      messageForAdmin,
      "am7011793@gmail.com"
    );
    await this.send(
      `Reported by ${user.name} in HealthTalk`,
      messageForDoctor,
      doctor?.email
    );
  }
};
