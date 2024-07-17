const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

// Define the log directory
const logDirectory = path.join(__dirname, '../production_logs');

// Create the log directory if it does not exist
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});

const development = {
    name: 'development',
    asset_path: '/assets',
    session_cookie_key: 'blahsomething',
    db: 'contact_list_db',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'jainendrasingh516@gmail.com',
            pass: 'okvi swjl luyq jube'
        }
    },
    google_client_id: "504008483309-rj7dk3lc8lhuq8ebk9ufoe2br81u0111.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_url: "http://localhost:5503/message/user/auth/google/callback",
    jwt_secret: 'webal',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
};

const production =  {
    name: 'production',
    asset_path: process.env.WEBAL_ASSET_PATH,
    session_cookie_key: process.env.WEBAL_SESSION_COOKIE_KEY,
    db: process.env.WEBAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.WEBAL_USERNAME,
            pass: process.env.WEBAL_PASSWORD
        }
    },
    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.GOOGLE_CALLBACK_RURL,
    jwt_secret: process.env.WEBAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
};

module.exports = development;
