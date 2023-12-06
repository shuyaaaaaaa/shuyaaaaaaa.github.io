const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const ssm = new SSMClient({ region: 'eu-west-1' });

async function getParameter(parameterName) {
    const params = {
        Name: parameterName,
        WithDecryption: true
    };
    const command = new GetParameterCommand(params);
    const response = await ssm.send(command);
    return response.Parameter.Value;
}

app.post('/send-email', async (req, res) => {
    let ICLOUD_EMAIL_USER, ICLOUD_APP_SPECIFIC_PASSWORD, RECIPIENT_EMAIL;

    const COPILOT_APPLICATION_NAME = process.env.COPILOT_APPLICATION_NAME || "shuya-website";
    const COPILOT_ENVIRONMENT_NAME = process.env.COPILOT_ENVIRONMENT_NAME || "shuya-environment";

    try {
        ICLOUD_EMAIL_USER = await getParameter(`/copilot/${COPILOT_APPLICATION_NAME}/${COPILOT_ENVIRONMENT_NAME}/secrets/ICLOUD_EMAIL_USER`);
        ICLOUD_APP_SPECIFIC_PASSWORD = await getParameter(`/copilot/${COPILOT_APPLICATION_NAME}/${COPILOT_ENVIRONMENT_NAME}/secrets/ICLOUD_APP_SPECIFIC_PASSWORD`);
        RECIPIENT_EMAIL = await getParameter(`/copilot/${COPILOT_APPLICATION_NAME}/${COPILOT_ENVIRONMENT_NAME}/secrets/RECIPIENT_EMAIL`);
    } catch (error) {
        console.error("Error fetching parameters:", error);
        return res.status(500).send("Error fetching email parameters.");
    }

    let { name, email, subject, comment } = req.body;

    let transporter = nodemailer.createTransport({
        host: 'smtp.mail.me.com',
        port: 587,
        secure: false,
        auth: {
            user: ICLOUD_EMAIL_USER,
            pass: ICLOUD_APP_SPECIFIC_PASSWORD
        }
    });

    let mailOptions = {
        from: ICLOUD_EMAIL_USER,
        replyTo: email,
        to: RECIPIENT_EMAIL,
        subject: subject,
        text: `From: ${name} \nEmail: ${email} \n\n${comment}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Failed to send email: ' + error.message });
        } else {
            res.status(200).json({ message: 'Email sent: ' + info.response });
            transporter.close();
        }
    });
});

app.get('/', (req, res) => {
    res.send('Express server is running.');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server started on http://0.0.0.0:${port}`);
});
