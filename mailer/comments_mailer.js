const nodeMailer = require('../config/nodemailer');

// this is another way of exporting a method
exports.newComment = async (comment) => {
    console.log('inside newComment mailer', comment);

    try {
        let info = await nodeMailer.transporter.sendMail({
            from: 'WebAL.in',
            to: comment.user.email,
            subject: "New Comment Published!",
            html: '<h1>Yup, your comment is now published!</h1>'
        });

        console.log('Message sent', info);
        return info;
    } catch (err) {
        console.log('Error in sending mail', err);
        throw err; // Rethrow the error for handling at a higher level
    }
}
