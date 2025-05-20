const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "pgthelanguage@gmail.com", // Replace with your Gmail address
        pass: "cfno wrkg nrog jkvz", // Replace with your App Password from Google Account settings
    },
});

const emailTemplates = {
    // Registration related emails
    guideRegistration: (firstName) => ({
        subject: "Welcome to Park Guide Training System",
        body: `
            Dear ${firstName},
            
            Thank you for registering as a Park Guide. Your application is currently under review.
            We will notify you once your application has been processed.
            
            Best regards,
            Park Guide Training Team
        `,
    }),

    guideApproval: (firstName) => ({
        subject: "Park Guide Application Approved",
        body: `
            Dear ${firstName},
            
            Congratulations! Your application to become a park guide has been approved.
            You can now log in to access your training modules and begin your journey.
            
            Best regards,
            Park Guide Training Team
        `,
    }),

    guideRejection: (firstName) => ({
        subject: "Park Guide Application Status",
        body: `
            Dear ${firstName},
            
            We regret to inform you that your application has not been approved at this time.
            
            Best regards,
            Park Guide Training Team
        `,
    }),

    // Training module emails
    moduleAssignment: (firstName, moduleName) => ({
        subject: "New Training Module Assignment",
        body: `
            Dear ${firstName},
            
            A new training module "${moduleName}" has been assigned to you.
            Please log in to your dashboard to begin the module.
            
            Best regards,
            Park Guide Training Team
        `,
    }),

    moduleCompletion: (firstName, moduleName) => ({
        subject: "Training Module Completed",
        body: `
            Dear ${firstName},
            
            Congratulations on completing the "${moduleName}" training module!
            Keep up the great work on your training journey.
            
            Best regards,
            Park Guide Training Team
        `,
    }),

    // Certification emails
    certificationApproved: (firstName, certificationName, expiryDate) => ({
        subject: "Certification Status Update",
        body: `
            Dear ${firstName},
            
            Congratulations! Your ${certificationName} certification has been approved.
            Your certification is valid until ${expiryDate}.
            
            Best regards,
            Park Guide Training Team
        `,
    }),

    certificationExpiring: (firstName, certificationName, expiryDate) => ({
        subject: "Certification Expiration Notice",
        body: `
            Dear ${firstName},
            
            Your ${certificationName} certification will expire on ${expiryDate}.
            Please initiate the renewal process soon to maintain your certification status.
            
            Best regards,
            Park Guide Training Team
        `,
    }),

    // Park assignment emails
    parkAssignment: (firstName, parkName) => ({
        subject: "New Park Assignment",
        body: `
            Dear ${firstName},
            
            You have been assigned to ${parkName}.
            Please check your dashboard for more details about your assignment.
            
            Best regards,
            Park Guide Training Team
        `,
    }),
};

const sendEmail = async ({ to, template, data }) => {
    try {
        const emailContent = emailTemplates[template](data);

        await transporter.sendMail({
            from: "pgthelanguage@gmail.com", // Should match your auth.user
            to,
            subject: emailContent.subject,
            html: emailContent.body.replace(/\n/g, "<br>"),
        });

        console.log(`Email sent successfully to ${to}`);
        return true;
    } catch (error) {
        console.error("Email sending failed:", error);
        return false;
    }
};

module.exports = {
    sendEmail,
};
