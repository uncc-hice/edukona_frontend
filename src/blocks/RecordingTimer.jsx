import { Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react"

const formatTimeStr = (time) => {
	if (time > 9) {
		return `${time}`;
	} else {
		return `0${time}`;
	}
}

const RecordingTimer = ({active}) => {
	const startTime = useRef(null);
	const [timeStr, setTimeStr] = useState(null);
	const interval = useRef(null);

	const startTimer = () => {
		startTime.current = Date.now();
		interval.current = setInterval(() => {
			const elapsed = (Date.now() - startTime.current)/1000;
			const seconds = Math.floor(elapsed % 60);
			const mins = Math.floor(elapsed/60);
			const hours = Math.floor(elapsed/3600);
			setTimeStr(`${formatTimeStr(hours)}:${formatTimeStr(mins)}:${formatTimeStr(seconds)}`);
		}, 250);
	}

	useEffect(() => {
		setTimeStr('00:00:00');
		startTimer();
		return () => clearInterval(interval.current);
	}, [active]);

	if (active) {
		return <Typography variant="h6" marginLeft={'5px'}>{timeStr}</Typography>
	}
	clearInterval(interval.current);
	return null;
}

export default RecordingTimer;
