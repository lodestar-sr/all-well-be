import { Injectable } from '@nestjs/common';

import { SimpleMail } from '../message.types';

let client = null;
const nodemailer = require('nodemailer');

@Injectable()
export class MessagingService {
  constructor() {
    client = require('twilio')(process.env["TWILIO_ACCOUNT_SID"], process.env["TWILIO_AUTH_TOKEN"]);
  }

  async sendMail(data: SimpleMail) {
    return new Promise((resolve, reject) => {
      let transporter = nodemailer.createTransport({
        host: process.env['SMTP_HOST'],
        port: process.env['SMTP_PORT'],
        secure: process.env['SMTP_SECURE'], // true for 465, false for other ports
        auth: {
          user: process.env['SMTP_USERNAME'],
          pass: process.env['SMTP_PASSWORD'],
        },
        tls: {
          minDHSize: 512,
          minVersion: 'TLSv1',
          maxVersion: 'TLSv1.3',
          ciphers: 'ALL',
        },
        logger: true,
        debug: true, // include SMTP traffic in the logs
      });
      const mailOptions = {
        from: data['from'] || process.env['SMTP_USERNAME'], // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        html: this.mailTemplate(data),
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    })
  }

  genOTP(len: number): string {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < len; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }

  mailTemplate(data: SimpleMail) {
    return `<!DOCTYPE html>
      <html style='font-family: Inter, Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;'>
      <head>
        <meta name='viewport' content='width=device-width' />
        <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
        <title>${data.subject}</title>
        <style type='text/css'>
            img {
                max-width: 100%;
            }
      
            body {
                -webkit-font-smoothing: antialiased;
                -webkit-text-size-adjust: none;
                width: 100% !important;
                height: 100%;
                line-height: 1.6em;
            }
      
            body {
                background-color: #f6f6f6;
            }
      
            @media only screen and (max-width: 640px) {
                body {
                    padding: 0 !important;
                }
      
                h1 {
                    font-weight: 800 !important;
                    margin: 20px 0 5px !important;
                }
      
                h2 {
                    font-weight: 800 !important;
                    margin: 20px 0 5px !important;
                }
      
                h3 {
                    font-weight: 800 !important;
                    margin: 20px 0 5px !important;
                }
      
                h4 {
                    font-weight: 800 !important;
                    margin: 20px 0 5px !important;
                }
      
                h1 {
                    font-size: 22px !important;
                }
      
                h2 {
                    font-size: 18px !important;
                }
      
                h3 {
                    font-size: 16px !important;
                }
      
                .container {
                    padding: 0 !important;
                    width: 100% !important;
                }
      
                .content {
                    padding: 0 !important;
                }
      
                .content-wrap {
                    padding: 10px !important;
                }
      
                .invoice {
                    width: 100% !important;
                }
            }
        </style>
      </head>
      
      <body itemscope itemtype='http://schema.org/EmailMessage'
            style='font-family: Inter,Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;'
            bgcolor='#f6f6f6'>
      
      <table class='body-wrap'
             style='font-family: Inter,Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;'
             bgcolor='#f6f6f6'>
        <tr style='font-family: Inter,Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;'>
          <td
            style='font-family: Inter,Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;'
            valign='top'></td>
          <td class='container' width='600'
              style='font-family: Inter,Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;'
              valign='top'>
            <div class='content'
                 style='font-family: Inter,Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 20px auto;'>
              <table class='main' width='100%' cellpadding='0' cellspacing='0'
                     style='font-family: Inter,Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; padding: 95px 70px; border: 1px solid #e9e9e9;'
                     bgcolor='#fff'>
                <tr
                  style='font-family: Inter,Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;'>
                  <td class='alert alert-warning'
                      style='font-family: Inter,Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 16px; vertical-align: top; font-weight: 500; text-align: left; border-radius: 3px 3px 0 0; margin: 0; padding: 20px;'
                      align='left' valign='top'>
                    <svg width="149" height="48" viewBox="0 0 149 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <mask id="mask0_1_440" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="37" y="0" width="11" height="32">
                        <path d="M37.9198 0H47.7789V31.7419H37.9198V0Z" fill="white"/>
                      </mask>
                      <g mask="url(#mask0_1_440)">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M43.6125 0V23.5056C43.6125 26.6976 44.8089 27.3443 47.5727 26.8697L47.7789 31.3983C41.6324 32.563 37.9198 30.9673 37.9198 23.5056V0H43.6125Z" fill="#272626"/>
                      </g>
                      <mask id="mask1_1_440" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="50" y="0" width="11" height="32">
                        <path d="M50.8124 0H60.6715V31.7419H50.8124V0Z" fill="white"/>
                      </mask>
                      <g mask="url(#mask1_1_440)">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M56.5051 0V23.5056C56.5051 26.6976 57.7015 27.3443 60.4653 26.8697L60.6715 31.3983C54.5249 32.563 50.8124 30.9673 50.8124 23.5056V0H56.5051Z" fill="#272626"/>
                      </g>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M105.916 19.0466H114.835C115.126 16.3258 113.342 14.4687 110.604 14.4687C107.7 14.4687 106.414 16.5414 105.916 19.0466ZM119.441 22.8033H105.916C106.289 26.2145 109.069 26.7332 111.226 26.9489C113.715 27.0782 116.246 26.6897 118.652 25.6535L119.316 29.9285C116.951 31.0945 114.214 31.7419 111.558 31.7419C104.671 31.7419 100.108 27.6827 100.108 20.6442C100.108 13.6056 105.46 10.0645 110.604 10.0645C117.905 10.0645 120.976 15.7213 119.441 22.8033Z" fill="#272626"/>
                      <mask id="mask2_1_440" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="125" y="0" width="10" height="32">
                        <path d="M125.135 0H134.994V31.7419H125.135V0Z" fill="white"/>
                      </mask>
                      <g mask="url(#mask2_1_440)">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M130.828 0V23.5056C130.828 26.6976 132.024 27.3443 134.788 26.8697L134.994 31.3983C128.847 32.563 125.135 30.9673 125.135 23.5056V0H130.828Z" fill="#272626"/>
                      </g>
                      <mask id="mask3_1_440" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="138" y="0" width="11" height="32">
                        <path d="M138.786 0H148.645V31.7419H138.786V0Z" fill="white"/>
                      </mask>
                      <g mask="url(#mask3_1_440)">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M144.479 0V23.5056C144.479 26.6976 145.675 27.3443 148.439 26.8697L148.645 31.3983C142.499 32.563 138.786 30.9673 138.786 23.5056V0H144.479Z" fill="#272626"/>
                      </g>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M92.0306 10.8388L89.9883 16.8663L88.4238 21.5683H88.2937L83.5577 11.3091H81.255L76.5628 21.5683H76.4757L74.8682 16.8663L72.6519 10.8388H72.0475C72.0503 10.8456 72.0531 10.8527 72.0559 10.8595H72.0593C73.3627 13.9449 74.0861 17.3251 74.0861 20.8693C74.0861 23.2829 73.7451 25.6183 73.1205 27.839L74.7813 31.742H77.475L79.8647 26.8687L82.3844 21.2691L84.9918 26.6975L87.5987 31.742H89.9012L98.5913 11.5228V10.8388H92.0306Z" fill="#272626"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9504 11.6129L15.9264 11.662L20.4768 20.9032L15.9504 11.6129Z" fill="#272626"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M15.1893 11.7687L11.051 21.9011H19.3283L15.1893 11.7687ZM16.6825 1.5484L17.3397 1.54841L30.3356 31.3549C32.6108 36.3871 41.0474 41.9406 48.0581 41.9406C59.529 41.9406 68.8606 32.5099 68.8606 20.9174C68.8606 19.3714 68.6831 17.869 68.3652 16.4188L68.3507 16.384L68.347 16.3679C67.9513 14.5762 67.3362 12.867 66.5211 11.2766L66.5158 11.2659L66.3593 10.8387H72.0472L72.6436 10.8368C73.9258 13.9624 74.3224 17.8355 74.3224 21.4244C74.3224 23.8724 73.9859 26.2411 73.3696 28.4936L73.38 28.5187C70.3079 39.7372 60.1232 48 48.0581 48C37.5387 48 27.7039 41.1735 23.51 32.129L23.4518 31.9284L21.3763 27.4279H8.96001L6.65646 32.5161H0V31.6388L13.7385 1.5484H16.6825Z" fill="url(#paint0_linear_1_440)"/>
                      <defs>
                        <linearGradient id="paint0_linear_1_440" x1="14.8645" y1="30.0387" x2="46.7612" y2="30.0387" gradientUnits="userSpaceOnUse">
                          <stop stop-color="#006EFF"/>
                          <stop offset="1" stop-color="#2ED477"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </td>
                </tr>
                <tr
                  style='font-family: Inter,Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;'>
                  <td class='content-wrap'
                      style='font-family: Inter,Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;'
                      valign='top'>
                    <table width='100%' cellpadding='0' cellspacing='0'
                           style='font-family: Inter,Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;'>
                      <tr
                        style='font-family: Inter,Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;'>
                        <td class='content-block'
                            style='font-family: Inter,Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 20px; line-height: 25px; vertical-align: top; margin: 0; padding: 0 0 20px;'
                            valign='top'>
                          Hi!<br>
                          We received a request to reset your password.<br>
                          Please click on the link below to proceed.
                        </td>
                      </tr>
                      ${data['link'] ? `
                      <tr
                        style='font-family: Inter,Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0 0;'>
                        <td class='content-block'
                            style='font-family: Inter,Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px 0 20px;'
                            valign='top'>
                          <a href="${data['link'].link}" class='btn-primary'
                             style='font-family: Inter,Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 13px; color: #000000; text-decoration: none; line-height: 2em; font-weight: bold; text-align: center; cursor: pointer; display: inline-block; border-radius: 50px; text-transform: capitalize; background-color: #4EE0BC; margin: 0 20px; width: 100% border-color: #4EE0BC; border-style: solid; border-width: 10px 20px;'>${data['link'].label}</a>
                        </td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style='padding-top: 40px; font-family: Inter,Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 20px;'>
                          The All Well team
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>
          </td>
          <td
            style='font-family: Inter,Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;'
            valign='top'></td>
        </tr>
      </table>
      </body>
      </html>`;
  }
}
