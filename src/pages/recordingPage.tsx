import { Pause, Square, X } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useApp } from "../components/context/context";
import { formatElapsed, getNowStrings } from "../utils/dateTime";
import { Waveform } from "../components/recording/waveform";

export function RecordingPage() {
  const navigate = useNavigate();
  const { pid } = useParams<{ pid: string }>();
  const { elapsed, timerRef } = useApp();
  const { dateString, timeString } = getNowStrings();

  const pauseRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    navigate(`/projects/${pid}/record/paused`);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    navigate(`/projects/${pid}/record/summarizing`);
  };

  const cancelRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    navigate(`/projects/${pid}`);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="relative flex items-center justify-center border-b border-border px-10 py-5">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-destructive" />
          <p className="text-sm font-light text-foreground/70">
            {dateString} {timeString}
          </p>
        </div>
        <span className="absolute right-10 text-sm font-light tabular-nums text-destructive">
          {formatElapsed(elapsed)}
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-10 pb-10">
        <Waveform active />
        <div className="flex items-center gap-8">
          <button
            onClick={cancelRecording}
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-border text-foreground/50 transition-all hover:border-foreground/40 hover:text-foreground/70"
          >
            <X size={18} />
          </button>
          <button
            onClick={pauseRecording}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive text-white shadow-lg shadow-destructive/30 transition-all hover:scale-105 active:scale-95"
          >
            <Pause size={22} />
          </button>
          <button
            onClick={stopRecording}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-white transition-all hover:bg-foreground/80 active:scale-95"
          >
            <Square size={16} fill="white" />
          </button>
        </div>
      </div>
    </div>
  );
}
