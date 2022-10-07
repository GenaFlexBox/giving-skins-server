import nodemailer from "nodemailer"

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "genaproti@gmail.com",
        pass: "becejnchovshjsmu",
      }
    })
  }

  async sendActivationLink(to, link) {
    await this.transporter.sendMail({
      from: "genaproti@gmail.com",
      to,
      subject: "Активация аккаунта на сайте",
      text: '',
      html: `
        <div>
          <h1>Для активации перейдите по ссылке</h1>
          <a href="${link}">${link}</a>
        </div>
      `
    })
  }

}

export default new MailService()