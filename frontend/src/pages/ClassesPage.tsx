import { useCallback, useEffect, useState } from "react";
import { fetchClassSchedules, type ClassSchedule } from "../../api/class";
import {
  fetchCurrentBookings,
  createBooking,
  cancelBooking,
} from "../../api/booking";
import ClassFilter from "../components/Filter";
import { Card } from "../components/card";
import Navbar from "../components/navbar";
import { useMembers } from "../hooks/UseMembers";
import { Modal } from "../components/modal";
import { ErrorAlert } from "../components/alert";

type FilterFromComponent = {
  date: string | null; // 'yyyy-MM-dd' or null
  timeRange: string | null; // 'morning' | 'afternoon' | 'night' or null
};

export default function ClassesPage() {
  const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { members } = useMembers();
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [currentBookings, setCurrentBookings] = useState<
    { schedule_id: number; booking_id: number }[]
  >([]);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!activeUserId) return;

    async function loadBookings() {
      try {
        const bookings = await fetchCurrentBookings(activeUserId!);
        setCurrentBookings(bookings);
      } catch (err) {
        console.error(err);
      }
    }

    loadBookings();
  }, [activeUserId]);

  // Fetch function that accepts the exact params our API expects
  const loadSchedules = useCallback(
    async (filters: {
      date?: string;
      time_from?: string;
      time_to?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchClassSchedules(
          filters.date,
          filters.time_from,
          filters.time_to
        );
        console.log("API Response:", data);
        setSchedules(data);
      } catch (err: any) {
        console.error(err);
        setError(err?.message ?? "Failed to load schedules");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Adapter: convert the ClassFilter's (date, timeRange) into API params
  const handleFilterChange = useCallback(
    (f: FilterFromComponent) => {
      // Map timeRange to time_from/time_to
      let time_from: string | undefined = undefined;
      let time_to: string | undefined = undefined;

      if (f.timeRange === "morning") {
        time_from = "06:00";
        time_to = "12:00";
      } else if (f.timeRange === "afternoon") {
        time_from = "12:00";
        time_to = "18:00";
      } else if (f.timeRange === "night" || f.timeRange === "evening") {
        // Accept either name ('night' from filter or 'evening' if used elsewhere)
        time_from = "18:00";
        time_to = "22:00";
      }

      loadSchedules({
        date: f.date ?? undefined,
        time_from,
        time_to,
      });
    },
    [loadSchedules]
  );

  // initial load: no filters
  useEffect(() => {
    if (activeUserId) {
      loadSchedules({});
    }
  }, [loadSchedules, activeUserId]);

  // Set first member as active by default
  useEffect(() => {
    if (members.length > 0 && !activeUserId) {
      setActiveUserId(members[0].member_id);
    }
  }, [members, activeUserId]);
  async function handleBookingToggle(scheduleId: number) {
    if (!activeUserId) return;

    const existing = currentBookings.find((b) => b.schedule_id === scheduleId);

    try {
      if (existing) {
        await cancelBooking(activeUserId, existing.booking_id);
        setCurrentBookings((prev) =>
          prev.filter((b) => b.schedule_id !== scheduleId)
        );
        console.log("cancelled");
        setModalMessage("Your booking has been cancelled successfully!");
      } else {
        const booking = await createBooking(activeUserId, scheduleId);
        setCurrentBookings((prev) => [
          ...prev,
          { schedule_id: scheduleId, booking_id: booking.id },
        ]);
        console.log("booked");
        setModalMessage("Your booking was successful!");
      }
      // ⬅️ NEW: refresh schedules after change
      await loadSchedules({});
    } catch (err: any) {
      console.error(err.message);
      setErrorMessage(err.message);
    }
  }

  return (
    <div className="m-0">
      {members.length > 0 && (
        <Navbar
          users={members.map((m) => ({
            id: m.member_id,
            name: m.first_name,
          }))}
          initialUserId={activeUserId ?? members[0].member_id}
          onUserChange={(u) => setActiveUserId(u.id)}
        />
      )}
      <div className="mt-8 m-5">
        <h3 className="text-xl font-extrabold mb-4">Explore Classes</h3>
        <p>
          {" "}
          Find the right class for your goals and take the next step in your
          learning journey today.
        </p>
        <div className="mb-6">
          <ClassFilter onFilterChange={handleFilterChange} />
        </div>
        <div className="mx-auto w-3/4 ml-7 mt-6">
          {loading && <p className="text-gray-500">Loading classes…</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && schedules.length === 0 && <p>No classes found.</p>}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 mt-4">
            {schedules.map((schedule) => {
              const {
                class: classInfo,
                id,
                duration,
                scheduled_date,
                taken_spots,
                time_from,
                total_spots,
                trainer,
              } = schedule;
              console.log(scheduled_date);
              const isBooked = currentBookings.some(
                (b) => b.schedule_id === schedule.id
              );
              const disabled = taken_spots === total_spots && !isBooked;
              return (
                <Card
                  key={id}
                  className={classInfo.class_name}
                  scheduledDate={new Date(scheduled_date + "T00:00:00")}
                  time={time_from}
                  duration={duration}
                  trainer={trainer}
                  difficulty={classInfo.difficulty}
                  seatsLeft={total_spots - taken_spots}
                  type={classInfo.type}
                  description={classInfo.description}
                  isBooked={isBooked}
                  disabled={disabled}
                  onButtonClick={() => handleBookingToggle(schedule.id)}
                  premium_status={classInfo.premium_status}
                />
              );
            })}
          </div>
        </div>
      </div>
      <Modal
        isOpen={!!modalMessage}
        message={modalMessage || ""}
        onClose={() => setModalMessage(null)}
      />
      <ErrorAlert
        isOpen={!!errorMessage}
        message={errorMessage || ""}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
}
