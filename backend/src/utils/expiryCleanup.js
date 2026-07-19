import Donation from "../model/donation.model.js";

const combineDateAndTime = (dateStr, timeStr) => {
  const date = new Date(dateStr);
  const [hours, minutes] = timeStr.split(":").map(Number);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
    0,
    0
  );
};

const cancelExpiredDonations = async () => {
  try {
    const pendingDonations = await Donation.find({ Status: "Pending" });
    const now = new Date();
    let cancelledCount = 0;

    for (const donation of pendingDonations) {
      const expiry = combineDateAndTime(donation.ExpiryDate, donation.ExpiryTime);
      if (expiry <= now) {
        await Donation.findByIdAndUpdate(donation._id, {
          Status: "Cancelled",
        });
        cancelledCount++;
      }
    }

    if (cancelledCount > 0) {
      console.log(`[expiryCleanup] Cancelled ${cancelledCount} expired donation(s)`);
    }
  } catch (error) {
    console.error("[expiryCleanup] Error:", error.message);
  }
};

const startExpiryCleanup = () => {
  // Run immediately on startup, then every 60 seconds
  cancelExpiredDonations();
  setInterval(cancelExpiredDonations, 60 * 1000);
};

export default startExpiryCleanup;
