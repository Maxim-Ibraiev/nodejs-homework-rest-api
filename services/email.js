const { send } = require('@sendgrid/mail')
const sgMail = require('@sendgrid/mail')
const Mailgen = require('mailgen')
require('dotenv').config()

const EMAIL = process.env.EMAIL
const link =
  // process.env.NODE_ENV === 'developer'
  // ?
  `http://localhost:${process.env.PORT || 3000}`
// : 'my link'

class EmailService {
  constructor() {
    this.sender = sgMail
    this.generateTemplate = Mailgen
  }

  createTemplateVerifyEmail(verifyToken, user) {
    const emailGenerator = new this.generateTemplate({
      theme: 'default',
      product: {
        name: 'Service contacts',
        link,
      },
    })

    const email = {
      body: {
        name: user.name,
        intro: "Welcome to Mailgen! We're very excited to have you on board.",
        action: {
          instructions: 'To get started with Mailgen, please click here:',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm your account',
            link: `${link}/users/verify/${verifyToken}`,
          },
        },
      },
    }

    return emailGenerator.generate(email)
  }

  async sendVerifyEmail(verifyToken, user) {
    this.sender.setApiKey(process.env.EMAIL_TOKEN)

    const msg = {
      to: user.email, // Change to your recipient
      from: EMAIL, // Change to your verified sender
      subject: 'Verify email',
      text: 'and easy to do anywhere, even with Node.js',
      html: this.createTemplateVerifyEmail(verifyToken, user),
    }

    this.sender
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
  }
}

module.exports = EmailService
