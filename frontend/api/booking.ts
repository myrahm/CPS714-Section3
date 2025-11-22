export async function fetchCurrentBookings(userId: string) {
  const res = await fetch(`http://localhost:8000/classes/my-bookings?user_id=${userId}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  // Return schedule IDs and booking IDs
  return data.bookings.map((b: any) => ({
    schedule_id: b.schedule_id,
    booking_id: b.id,
  }));
}

export async function createBooking(userId: string, scheduleId: number) {
  const res = await fetch("http://localhost:8000/classes/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, schedule_id: scheduleId }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.booking;
}

export async function cancelBooking(userId: string, bookingId: number) {
  const res = await fetch("http://localhost:8000/classes/cancel", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, booking_id: bookingId }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.booking_id;
}
