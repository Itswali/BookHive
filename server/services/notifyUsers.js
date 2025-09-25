import cron from "node-cron";


export const notifyUsers = () => {
  cron.schedule("*/30 * * * *", async () => {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const borrowers = await Borrow.find({
        dueDate: {
          $lt: oneDayAgo,
        },
        returnDate: null,
        notified: false,
      });
      for( const element of borrowers) {
        if(element.user  && element.user.email) {
          sendEmail({
            email,
            subject: "Book Return Reminder",
            message: `Hello ${element.user.name},\n\n This is a friendly reminder that the book you borrowed is due for return today. Please return the book as soon as possible.\n\nThank you,`,
          });
          element.notified = true;
          await element.save();
        }
      }

    } catch (error) {
      console.error("Some error occurred while notifying users:", error);
    }
  });
};
