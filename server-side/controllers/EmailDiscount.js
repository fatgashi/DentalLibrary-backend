const transporter = require('../config/transporter');
const Email = require('../models/emailsModel');


const EmailDiscount = {
    collectEmail: async (req,res) => {
        const { email } = req.body;

        try {
            const existingEmail = await Email.findOne({ email });

            if (existingEmail) {
            // Email already exists, return a message or status to indicate this
                return res.status(409).json({ message: 'Email already exists in our database' });
            }

            const newEmail = new Email({email});
            await newEmail.save();

            const mailOptions = {
                from: 'fatjon.gashii04@gmail.com',
                to: email,
                subject: 'Thank You for Joining Our Community - Enjoy a 10% Discount on Your Next E-book Purchase',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                    <style>
                        /* Inline CSS styles for formatting */
                        body {
                        font-family: Arial, sans-serif;
                        }
                        .discount {
                        font-weight: bold;
                        color: #FF5733;
                        }
                    </style>
                    </head>
                    <body>
                    <p>Dear ${email},</p>
                    <p>We hope this message finds you well and in high spirits. We greatly appreciate your interest in our e-book store and for sharing your email with us. As a token of our appreciation, we would like to extend a 10% discount on your next e-book purchase.</p>
                    <p>To avail of this discount, simply reply to this email with the title(s) of the e-book(s) you wish to purchase, and we will apply the 10% discount to your order. It's our way of saying thank you for joining our community of avid readers.</p>
                    <p><strong>Discount Details:</strong></p>
                    <ul>
                        <li>Discount Amount: 10% off your total purchase.</li>
                        <li>Discount Validity: Valid for the next 30 days.</li>
                        <li>How to Redeem: Just reply to this email with your selected e-book titles.</li>
                    </ul>
                    <p>Please note that this discount is applicable to all e-books available in our store. You have the flexibility to choose the titles that interest you the most.</p>
                    <p>Our team is excited to assist you with your selections and ensure that you enjoy your reading experience to the fullest. If you have any questions or need recommendations, please feel free to ask.</p>
                    <p>Thank you once again for becoming a part of our community. We look forward to helping you discover and enjoy the e-books that captivate your interests.</p>
                    <p><strong>Warm regards,</strong></p>
                    <p>Dental Books</p>
                    </body>
                    </html>
                `,
              };
          
              transporter.sendMail(mailOptions, null);
          
              res.status(201).json({ message: 'Email saved and welcome email sent successfully' });

        } catch(err) {
            res.status(500).json({ error: 'Error saving email!' });
        }
    }
}

module.exports = EmailDiscount;