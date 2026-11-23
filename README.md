# Shree Sawariya Ji – Website

Website for **Shree Sawariya Ji**, a school uniform, books and stationery shop in Dombivli East.

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home |
| `about.html` | About Us |
| `uniforms.html` | School Uniforms |
| `books-stationery.html` | Books & Stationery |
| `contact.html` | Contact Us + enquiry form |

## Project structure

```
assets/            CSS, JavaScript and images
includes/          PHPMailer library and mail settings (web access blocked by .htaccess)
send-enquiry.php   Handles the contact form and emails the enquiry
```

## Running locally

1. Install [XAMPP](https://www.apachefriends.org/) (or any Apache + PHP server).
2. Put this folder in `htdocs`, e.g. `C:\xampp\htdocs\sawariya`.
3. Start Apache and open http://localhost/sawariya/

The HTML pages work without PHP. You only need PHP for the contact form.

## Setting up the contact form email

The enquiry form sends email through Gmail SMTP using PHPMailer.

1. Copy `includes/mail-config.example.php` to `includes/mail-config.php`.
2. Turn on 2-Step Verification for the Gmail account, then create an
   [App Password](https://myaccount.google.com/apppasswords).
3. Fill in `smtp_user`, `smtp_pass` (the App Password) and `to_email` in `mail-config.php`.

`includes/mail-config.php` is listed in `.gitignore`, so it is never committed. Keep your password out of the repository.

## Deployment

Upload all files to any PHP hosting with Apache. Then create `includes/mail-config.php` on the server as described above.

## Contact

Phone / WhatsApp: +91 82862 82418
