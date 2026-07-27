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
    const now = new Date();
    // Query for donations that are still pending AND have already expired
    // We use a JavaScript filter after fetching since we can't easily query combined date+time in MongoDB
    // But we can at least filter by ExpiryDate <= today to reduce the set
    const todayStr = now.toISOString().split('T')[0]; // YYYY-MM-DD

    const potentiallyExpired = await Donation.find({
      Status: "Pending",
      ExpiryDate: { $lte: todayStr }
    }).select('ExpiryDate ExpiryTime _id');

    let cancelledCount = 0;
    for (const donation of potentiallyExpired) {
      const expiry = combineDateAndTime(donation.ExpiryDate, donation.ExpiryTime);
      if (expiry <= now) {
        await Donation.findByIdAndUpdate(donation._id, { Status: "Cancelled" });
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
  // Run immediately on startup, then every 5 minutes (more efficient than 60s)
  cancelExpiredDonations();
  setInterval(cancelExpiredDonations, 5 * 60 * 1000);
};

export default startExpiryCleanup;
