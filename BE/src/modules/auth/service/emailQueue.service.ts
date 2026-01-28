// Email sending is disabled in this environment.
// Keep a no-op function to preserve imports.
import { EmailJob } from "../../../common/interfaces/Email.interface.js";

export const queueEmail = async (job: EmailJob) => {
  console.log(`[email disabled] would send to: ${job?.to} subject: ${job?.subject}`);
  return { success: true, emailId: null };
};