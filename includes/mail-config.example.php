<?php
/*
 * Email settings for the contact form.
 *
 * Uses Gmail SMTP. You need a Gmail "App Password" (not your normal password):
 *   1. Turn on 2-Step Verification: https://myaccount.google.com/security
 *   2. Create an App Password:      https://myaccount.google.com/apppasswords
 *   3. Paste the 16-character password below (spaces don't matter).
 */
return [
    // Gmail account that SENDS the email
    'smtp_user' => 'your-gmail@gmail.com',
    'smtp_pass' => 'xxxx xxxx xxxx xxxx',   // Gmail App Password

    // Where enquiries should be DELIVERED (can be the same Gmail)
    'to_email'  => 'your-gmail@gmail.com',
    'to_name'   => 'Shree Sawariya Ji',

    // Usually no need to change these
    'smtp_host' => 'smtp.gmail.com',
    'smtp_port' => 587,
    'from_name' => 'Shree Sawariya Ji Website',
];
