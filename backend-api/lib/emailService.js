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

    // Approval and rejection emails
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
    moduleAssignment: (data) => ({
        subject: "New Training Module Assignment",
        body: `
            Dear ${data.firstName},
            
            A new training module "${data.moduleName}" has been assigned to you.
            Please log in to your dashboard to begin the module.
            
            Best regards,
            Park Guide Training Team
        `,
    }),

    moduleExpirationReminder: (firstName, moduleName, expiryDate) => ({
        subject: "Training Module Expiration Reminder",
        body: `
            Dear ${firstName},
            
            This is a reminder that your training module "${moduleName}" will expire on ${expiryDate}.
            Please complete the module before it expires to maintain your training status.
            
            Best regards,
            Park Guide Training Team
        `,
    }),

    // Module completion emails
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
    certificationApproved: (firstName) => ({
        subject: "License Certification Status Update",
        body: `
            Dear ${firstName},
            
            Congratulations! You have been certified as a park guide. You can now access your license certification details in your profile.
            Please ensure you keep your license certification up to date.
            
            Best regards,
            Park Guide Training Team
        `,
    }),

    certificationExpiring: (firstName, certificationName, expiryDate) => ({
        subject: "License Certification Expiration Notice",
        body: `
            Dear ${firstName},
            
            Your ${certificationName} certification will expire on ${expiryDate}.
            Please initiate the renewal process soon to maintain your certification status.
            
            Best regards,
            Park Guide Training Team
        `,
    }),

    licenseExpirationReminder: (firstName) => ({
        subject: "Park Guide License Expiration Notice",
        body: `
            Dear ${firstName},
            
            This is an important reminder that your park guide license will expire soon.
            
            To maintain your active status as a park guide, please complete your license renewal before the expiration date.
            
            If your license expires, you may not be able to continue your park guide duties until renewal is completed.
            
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

    // Profile deletion email
    guideProfileDeletion: (firstName) => ({
        subject: "Park Guide Profile Deletion Notice",
        body: `
            Dear ${firstName},
            
            This email is to inform you that your park guide profile has been deleted from our system.
            If you believe this was done in error, please contact our support team.
            
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
