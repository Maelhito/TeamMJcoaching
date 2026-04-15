"use client";

import { useState, useEffect } from "react";
import AppHeader from "@/components/AppHeader";
import BottomNav from "@/components/BottomNav";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "Coaching Individuel" | "Atelier" | "Coaching de Groupe";
  description?: string;
}

const EVENT_COLORS: Record<CalendarEvent["type"], string> = {
  "Coaching Individuel": "#B22222",
  "Atelier":             "#F59E0B",
  "Coaching de Groupe":  "#3B82F6",
};

const MONTHS_FR = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre",
];
const DAYS_FR = ["L","M","M","J","V","S","D"];

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// Returns Mon=0 … Sun=6 offset for the 1st of the month
function getFirstDayOffset(year: number, month: number): number {
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

export default function CalendrierPage() {
  const today = new Date();
  const todayStr = toDateStr(today);

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<string>(todayStr); // today auto-selected
  const [reminderSet, setReminderSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then(setEvents)
      .catch(() => {});
  }, []);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  // Build calendar grid
  const daysInMonth = getDaysInMonth(year, month);
  const offset = getFirstDayOffset(year, month);
  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to multiple of 7
  while (cells.length % 7 !== 0) cells.push(null);

  function dayStr(day: number): string {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function eventsForDay(day: number): CalendarEvent[] {
    return events.filter(e => e.date === dayStr(day));
  }

  const selectedEvents = events.filter(e => e.date === selected).sort((a, b) => a.time.localeCompare(b.time));

  // --- Notification / Reminder ---
  async function scheduleReminder(event: CalendarEvent) {
    if (!("Notification" in window)) {
      alert("Votre navigateur ne supporte pas les notifications.");
      return;
    }

    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }
    if (permission !== "granted") {
      alert("Permission de notification refusée. Activez-les dans les réglages de votre navigateur.");
      return;
    }

    const [h, m] = event.time.split(":").map(Number);
    const eventDate = new Date(`${event.date}T${event.time}:00`);
    const reminderTime = eventDate.getTime() - 30 * 60 * 1000;
    const delay = reminderTime - Date.now();

    if (delay < 0) {
      alert("Cet événement est déjà passé ou commence dans moins de 30 minutes.");
      return;
    }

    setTimeout(() => {
      new Notification(`⏰ Rappel : ${event.title}`, {
        body: `Commence à ${event.time} — dans 30 min`,
        icon: "/logo.jpeg",
      });
    }, delay);

    setReminderSet(prev => new Set(prev).add(event.id));

    const mins = Math.round(delay / 60000);
    alert(`✅ Rappel programmé — vous serez notifié dans ${mins} min (30 min avant ${event.time})`);
  }

  return (
    <div style={{ backgroundColor: "#0D0D0D", minHeight: "100vh", paddingBottom: 90 }}>
      <AppHeader />

      <div className="mx-auto" style={{ maxWidth: 480, paddingTop: 88 }}>

        {/* Header calendrier */}
        <div style={{ padding: "0 20px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={prevMonth}
            style={{ background: "none", border: "none", color: "#555", fontSize: "1.3rem", cursor: "pointer", padding: "4px 10px" }}
            aria-label="Mois précédent"
          >
            ‹
          </button>

          <h2 className="font-title" style={{ fontSize: "1.4rem", color: "#F5F5F0", letterSpacing: "0.06em" }}>
            {MONTHS_FR[month].toUpperCase()} {year}
          </h2>

          <button
            onClick={nextMonth}
            style={{ background: "none", border: "none", color: "#555", fontSize: "1.3rem", cursor: "pointer", padding: "4px 10px" }}
            aria-label="Mois suivant"
          >
            ›
          </button>
        </div>

        {/* Grille calendrier */}
        <div style={{ padding: "0 16px" }}>
          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 6 }}>
            {DAYS_FR.map((d, i) => (
              <div
                key={i}
                style={{
                  textAlign: "center", fontSize: "0.65rem", fontWeight: 700,
                  color: "#444", letterSpacing: "0.05em", padding: "4px 0",
                  fontFamily: "var(--font-body), system-ui",
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
            {cells.map((day, idx) => {
              if (!day) return <div key={idx} />;
              const ds = dayStr(day);
              const isToday = ds === todayStr;
              const isSelected = ds === selected;
              const dayEvents = eventsForDay(day);

              return (
                <button
                  key={idx}
                  onClick={() => setSelected(ds)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "flex-start", gap: 3,
                    padding: "8px 4px 6px",
                    borderRadius: 10,
                    border: isSelected ? "1.5px solid #B22222" : "1.5px solid transparent",
                    backgroundColor: isSelected ? "rgba(178,34,34,0.12)" : isToday ? "#161616" : "transparent",
                    cursor: "pointer",
                    transition: "background 0.15s, border-color 0.15s",
                  }}
                  aria-label={`${day} ${MONTHS_FR[month]}`}
                  aria-pressed={isSelected}
                >
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: isToday ? 800 : 500,
                      color: isSelected ? "#F5F5F0" : isToday ? "#B22222" : "#888",
                      lineHeight: 1,
                      fontFamily: "var(--font-body), system-ui",
                    }}
                  >
                    {day}
                  </span>

                  {/* Event dots */}
                  {dayEvents.length > 0 && (
                    <div style={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center", maxWidth: 24 }}>
                      {dayEvents.slice(0, 3).map((ev) => (
                        <div
                          key={ev.id}
                          style={{
                            width: 5, height: 5, borderRadius: "50%",
                            backgroundColor: EVENT_COLORS[ev.type],
                            flexShrink: 0,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Légende types */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "14px 20px 0" }}>
          {(Object.entries(EVENT_COLORS) as [CalendarEvent["type"], string][]).map(([type, color]) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: color }} />
              <span style={{ fontSize: "0.65rem", color: "#555", fontFamily: "var(--font-body), system-ui" }}>
                {type}
              </span>
            </div>
          ))}
        </div>

        {/* Séparateur */}
        <div style={{ height: 1, backgroundColor: "#1a1a1a", margin: "16px 20px" }} />

        {/* Événements du jour sélectionné */}
        <div style={{ padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ display: "inline-block", width: 3, height: 18, backgroundColor: "#B22222", borderRadius: 2 }} />
            <h3 className="font-title" style={{ fontSize: "1.1rem", color: "#F5F5F0", letterSpacing: "0.05em" }}>
              {selected === todayStr ? "AUJOURD'HUI" : selected.split("-").reverse().join("/")}
            </h3>
          </div>

          {selectedEvents.length === 0 ? (
            <div style={{
              backgroundColor: "#111", border: "1px solid #1a1a1a", borderRadius: 12,
              padding: "28px 20px", textAlign: "center",
            }}>
              <p style={{ fontSize: "0.8rem", color: "#444", fontFamily: "var(--font-body), system-ui" }}>
                Aucun événement ce jour
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {selectedEvents.map((ev) => {
                const color = EVENT_COLORS[ev.type];
                const hasReminder = reminderSet.has(ev.id);

                return (
                  <div
                    key={ev.id}
                    style={{
                      backgroundColor: "#111", border: `1px solid #1e1e1e`,
                      borderLeft: `3px solid ${color}`,
                      borderRadius: 12, padding: "14px 16px",
                      display: "flex", flexDirection: "column", gap: 8,
                    }}
                  >
                    {/* Event header */}
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                      <div>
                        <p style={{
                          fontSize: "0.88rem", fontWeight: 700, color: "#F5F5F0",
                          lineHeight: 1.3, margin: 0,
                          fontFamily: "var(--font-body), system-ui",
                        }}>
                          {ev.title}
                        </p>
                        <p style={{ fontSize: "0.72rem", color: "#555", margin: "4px 0 0", fontFamily: "var(--font-body), system-ui" }}>
                          🕐 {ev.time}
                        </p>
                      </div>

                      {/* Type badge */}
                      <span style={{
                        fontSize: "0.65rem", fontWeight: 700, padding: "3px 9px",
                        borderRadius: 99, backgroundColor: `${color}20`, color: color,
                        whiteSpace: "nowrap", flexShrink: 0,
                        fontFamily: "var(--font-body), system-ui",
                      }}>
                        {ev.type}
                      </span>
                    </div>

                    {ev.description && (
                      <p style={{ fontSize: "0.78rem", color: "#666", margin: 0, lineHeight: 1.5, fontFamily: "var(--font-body), system-ui" }}>
                        {ev.description}
                      </p>
                    )}

                    {/* Reminder button */}
                    <button
                      onClick={() => scheduleReminder(ev)}
                      disabled={hasReminder}
                      style={{
                        alignSelf: "flex-start",
                        padding: "7px 14px", borderRadius: 8, fontSize: "0.75rem",
                        fontWeight: 600, cursor: hasReminder ? "default" : "pointer",
                        border: hasReminder ? `1px solid ${color}30` : `1px solid ${color}50`,
                        backgroundColor: hasReminder ? `${color}10` : "transparent",
                        color: hasReminder ? color : "#888",
                        transition: "all 0.2s",
                        fontFamily: "var(--font-body), system-ui",
                      }}
                    >
                      {hasReminder ? "✅ Rappel programmé" : "🔔 Rappel 30 min avant"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
