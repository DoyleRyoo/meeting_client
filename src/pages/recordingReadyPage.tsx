import { Play, Square, X } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useApp } from "../components/context/context";
import { formatElapsed, getNowStrings } from "../utils/dateTime";
import { Waveform } from "../components/recording/waveform";

export function RecordingReadyPage() {
  const navigate = useNavigate();
  const { pid } = useParams<{ pid: string }>();
  const { setElapsed, timerRef } = useApp();
  const { dateString, timeString } = getNowStrings();

  const startRecording = () => {
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((elapsed) => elapsed + 1), 1000);
    navigate(`/projects/${pid}/record/active`);
  };

  const cancelRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    navigate(`/projects/${pid}`);
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="relative flex items-center justify-center border-b border-border px-10 py-5">
        <p className="text-sm font-light text-muted-foreground">
          {dateString} {timeString}
        </p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-10 pb-10">
        <Waveform active={false} />
        <div className="flex items-center gap-8">
          <button
            onClick={cancelRecording}
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-border text-foreground/50 transition-all hover:border-foreground/40 hover:text-foreground/70"
          >
            <X size={18} />
          </button>
          <button
            onClick={startRecording}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive text-white shadow-lg shadow-destructive/30 transition-all hover:scale-105 active:scale-95"
          >
            <Play size={22} className="ml-1" />
          </button>
          <button
            disabled
            className="flex h-12 w-12 cursor-not-allowed items-center justify-center rounded-xl bg-foreground/10 text-foreground/20"
            aria-label={`녹음 시간 ${formatElapsed(0)}`}
          >
            <Square size={16} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}
