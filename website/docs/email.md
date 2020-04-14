---
id: email
title: Email
sidebar_label: Email
---

> By default accounts-js will print the emails json in the console.

## Configuration

```javascript
// Options for AccountsServer
const options = {
  // You can handle sending the emails by providing an optional sendMail function
  sendMail: ({ from, subject, to, text, html }): Promise<void>
};

const accountsServer = new AccountsServer(options);
```

## Overwrite the email templates

To overwrite the email templates:

```javascript
// Options for AccountsServer
const options = {
  emailTemplates: {
    from: 'my-app <no-reply@my-app.com>',
    verifyEmail: {
      subject: (user) => `Verify your account email ${user.profile.lastname}`,
      text: (user, url) => `To verify your account email please click on this link: ${url}`,
      // Html is not mandatory
      html: (user, url) => `<p>To verify your account email please click on this link: ${url}<p>`,
    },
    resetPassword: // Same as verifyEmail
    enrollAccount: // Same as verifyEmail
    passwordChanged:  // Same as verifyEmail
  },
};

const accountsServer = new AccountsServer(options);
```

## Example using [nodemailer](https://github.com/nodemailer/nodemailer)

```javascript
import nodemailer from 'nodemailer';

// Initiate nodemailer
const transporter = nodemailer.createTransport({
  ...myNodemailerOptions,
});

// Options for AccountsServer
const options = {
  sendMail: ({ from, subject, to, text, html }) => {
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
  },
};

const accountsServer = new AccountsServer(options);
```

## Example using [emailjs](https://github.com/eleith/emailjs)

```javascript
import emailjs from 'emailjs';

// inititate emailjs
const server = email.server.connect({
  ...myEmailjsOptions,
});

// Options for AccountsServer
const options = {
  sendMail: ({ from, subject, to, text, html }) => {
    return new Promise((resolve, reject) => {
      server.send(
        {
          text,
          from,
          to,
          subject,
        },
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  },
};

const accountsServer = new AccountsServer(options);
```
