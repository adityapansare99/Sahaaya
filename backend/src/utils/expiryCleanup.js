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
    0,
  );
};

const cancelExpiredDonations = async () => {
  try {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const potentiallyExpired = await Donation.find({
      Status: "Pending",
      ExpiryDate: { $lte: todayStr },
    }).select("ExpiryDate ExpiryTime _id");

    let cancelledCount = 0;
    for (const donation of potentiallyExpired) {
      const expiry = combineDateAndTime(
        donation.ExpiryDate,
        donation.ExpiryTime,
      );
      if (expiry <= now) {
        await Donation.findByIdAndUpdate(donation._id, { Status: "Cancelled" });
        cancelledCount++;
      }
    }

    if (cancelledCount > 0) {
      console.log(
        `[expiryCleanup] Cancelled ${cancelledCount} expired donation(s)`,
      );
    }
  } catch (error) {
    console.error("[expiryCleanup] Error:", error.message);
  }
};

const startExpiryCleanup = () => {
  cancelExpiredDonations();
  setInterval(cancelExpiredDonations, 5 * 60 * 1000);
};

export default startExpiryCleanup;
