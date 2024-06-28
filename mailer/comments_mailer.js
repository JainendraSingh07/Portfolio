const nodeMailer = require('../config/nodemailer');

// this is another way of exporting a method
exports.newComment = async (comment) => {
    let htmlString = nodeMailer.renderTemplate({comment : comment}, '/comments/new_comment.ejs');

    try {
        let info = await nodeMailer.transporter.sendMail({
            from: 'WebAL.in',
            to: comment.user.email,
            subject: "New Comment Published!",
            html: htmlString
        });

        // console.log('Message sent', info);
        return info;
    } catch (err) {
        console.log('Error in sending mail', err);
        throw err; // Rethrow the error for handling at a higher level
    }
}
