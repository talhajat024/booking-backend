import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {

    private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // port 587 upgrades to TLS (STARTTLS)
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    async sendVerificationEmail(to:string,token:string){
        const link= `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        await this.transporter.sendMail({
            from: process.env.MAIL_FROM,
            to,
            subject: 'Verify your email',
            text: `Verify your email: ${link}\n\nThis link expires in 24 hours.`,
            html: `<p>Welcome! Please verify your email:</p>
                   <p><a href="${link}">Verify my email</a></p>
                   <p>This link expires in 24 hours.</p>`,
              });
    }

     async sendPasswordResetEmail(to:string,token:string){
        const link= `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        await this.transporter.sendMail({
            from: process.env.MAIL_FROM,
            to,
            subject: 'Reset your password',
            text: `Reset your password: ${link}\n\nThis link expires in 1 hour.\n\nIf you didn't ask for this, you can ignore this email.`,
            html: `<p>We received a request to reset your password:</p>
           <p><a href="${link}">Reset my password</a></p>
           <p>This link expires in 1 hour.</p>
           <p>If you didn't ask for this, you can ignore this email.</p>`,
              });
    }
}